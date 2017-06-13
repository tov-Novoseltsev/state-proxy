var objectAssign = require('object-assign'),
  behaviorSelector = require('./behaviorSelector');

function forEachProperty(propertiesDefinitionObject, func) {
  var propertyNames = [];
  if (propertiesDefinitionObject) {
    propertyNames = Object.keys(propertiesDefinitionObject);
  }
  for (var i = 0; i < propertyNames.length; i++) {
    if (func(propertyNames[i], i) === true) {
      break;
    }
  }
}

function getDefaultState(schema) {
  var defaultState = {
    val: Object.create(null)
  };

  forEachProperty(schema.properties, function (prop) {
    var childSchema = schema.properties[prop];
    defaultState.val[prop] = behaviorSelector.getDefaultState(childSchema);
  });

  return defaultState;
}

function constructState(schema, stateArg, overrides) {
  var state = stateArg || getDefaultState(schema);
  var retval = objectAssign({}, state);

  if (typeof overrides !== 'undefined') {
    objectAssign(retval, overrides);
    var valState = Object.create(null);
    if (typeof overrides.val !== 'undefined') {
      if (typeof schema.setDataTransform === 'function') {
        retval.val = schema.setDataTransform(retval.val);
      }

      forEachProperty(schema.properties, function (prop) {
        var childSchema = schema.properties[prop];
        var childState = state.val[prop];
        var childOverrides = objectAssign({}, overrides, { val: retval.val[prop] });
        if (!retval.val.hasOwnProperty(prop)) {
          delete childOverrides.val;
        }

        valState[prop] = behaviorSelector.constructState(childSchema, childState, childOverrides);
      });
    } else {
      forEachProperty(schema.properties, function (prop) {
        var childSchema = schema.properties[prop];
        var childState = state.val[prop];
        valState[prop] = behaviorSelector.constructState(childSchema, childState, overrides);
      });
    }
    retval.val = valState;
  }

  return retval;
}

function deconstructState(schema, getState) {
  var retval = Object.create(null);

  forEachProperty(schema.properties, function (prop) {
    var childSchema = schema.properties[prop];
    var childGetState = function () {
      return getState().val[prop];
    };
    childGetState.getParentState = getState;
    retval[prop] = behaviorSelector.deconstructState(childSchema, childGetState);
  });

  if (typeof (schema.getDataTransform) === 'function') {
    retval = schema.getDataTransform(retval);
  }

  return retval;
}

function constructSubOptions(propertyName, options) {
  var retval = Object.create(null);
  retval.schemaNode = options.schemaNode.properties[propertyName];
  retval.getState = function getState() {
    var state = options.getState() || {
      val: {}
    };
    return state.val[propertyName];
  };
  retval.getState.getParentState = options.getState;
  retval.setState = function setState(newVal) {
    var state = options.getState();
    state.val[propertyName] = newVal;
    return options.setState(state);
  };
  return retval;
}

function constructProxyProperties(options) {
  var retval = Object.create(null);
  forEachProperty(options.schemaNode.properties, function (prop) {
    var subOptions = constructSubOptions(prop, options);
    retval[prop] = behaviorSelector.create(subOptions);
  });
  return retval;
}

function createObjectProxy(options) {
  var proxyNode = Object.create(null);

  proxyNode.properties = constructProxyProperties(options);

  proxyNode.getDefaultState = getDefaultState.bind(null, options.schemaNode);

  proxyNode.getState = function getState(overrides) {
    var state = options.getState();
    return constructState(options.schemaNode, state, overrides);
  };

  proxyNode.val = function val(newVal) {
    if (typeof options.schemaNode.val !== 'undefined') {
      if (typeof (newVal) !== 'undefined') {
        console.log('WARNING: Setting operation for calculated property is not allowed');
      }
      return options.schemaNode.val(options.getState);
    }

    if (typeof (newVal) === 'undefined') {
      var retval = Object.create(null);
      forEachProperty(options.schemaNode.properties, function (prop) {
        retval[prop] = proxyNode.properties[prop].val();
      });
      return retval;
    }

    var state = proxyNode.getState(newVal);

    state.hasChanges = true;
    options.setState(state);
  };

  proxyNode.validate = function validate(ignoreChanges) {
    var retval = {
      isValid: true,
      validationMessage: ''
    };

    forEachProperty(options.schemaNode.properties, function (prop) {
      var validationResult = proxyNode.properties[prop].validate(ignoreChanges);
      if (!validationResult.isValid) {
        retval.invalidPropertyName = prop;
        retval.invalidPropertyResult = validationResult;
        retval.isValid = false;
        return true;
      }
    });

    return retval;
  };

  proxyNode.exposeRequiredErrors = function exposeRequiredErrors() {
    var state = proxyNode.getState({ hasChanges: true });
    options.setState(state);
  };

  proxyNode.resetToDefault = function resetToDefault() {
    var state = proxyNode.getDefaultState();
    options.setState(state);
  };

  return proxyNode;
}

module.exports = {
  getDefaultState: getDefaultState,
  constructState: constructState,
  deconstructState: deconstructState,
  create: createObjectProxy
};
