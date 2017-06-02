var objectAssign = require('object-assign'),
  behaviorSelector = require('./behaviorSelector');

function getDefaultState(schema) {
  return {
    val: schema.default || []
  };
}

function constructState(schema, stateArg, overrides) {
  var state = stateArg || getDefaultState(schema);
  var retval = objectAssign({}, state);

  if (typeof overrides !== 'undefined') {
    objectAssign(retval, overrides);
    if (typeof overrides.val !== 'undefined') {
      if (typeof schema.setDataTransform === 'function') {
        retval.val = schema.setDataTransform(overrides.val);
      }

      retval.val = retval.val.map(function (item) {
        var subOverrides = objectAssign({}, overrides, { val: item });
        return behaviorSelector.constructState(schema.listItem, undefined, subOverrides);
      });
    } else {
      retval.val = retval.val.map(function (subState) {
        return behaviorSelector.constructState(schema.listItem, subState, overrides);
      });
    }
  }

  // if (typeof (valOverride) !== 'undefined' /* && typeof(schema.val) === 'undefined'*/ ) {
  //   var val = valOverride;
  //   if (typeof (schema.setDataTransform) === 'function') {
  //     val = schema.setDataTransform(valOverride);
  //   }
  //   var newState = val.map(function (item) {
  //     return behaviorSelector.constructState(schema.listItem, undefined, item, otherOverrides);
  //   });
  //   objectAssign(retval, {
  //     val: newState
  //   });
  // } else if (typeof (otherOverrides) !== 'undefined') {
  //   var newStateWithOtherOverrides = retval.val.map(function (subState) {
  //     return behaviorSelector.constructState(schema.listItem, subState, undefined, otherOverrides);
  //   });
  //   objectAssign(retval, otherOverrides, {
  //     val: newStateWithOtherOverrides
  //   });
  // }

  return retval;
}

function deconstructState(schema, getState) {
  var retval = getState().val.map(function (stateItem) {
    var childGetState = function () {
      return stateItem;
    };
    childGetState.getParentState = getState;
    return behaviorSelector.deconstructState(schema.listItem, childGetState);
  });

  if (typeof (schema.getDataTransform) === 'function') {
    retval = schema.getDataTransform(retval);
  }

  return retval;
}

function constructProxyItem(options, itemState, index) {
  var subOptions = Object.create(null);

  subOptions.schemaNode = options.schemaNode.listItem;
  subOptions.getState = function getState() {
    var state = options.getState();
    return state.val[index];
  };
  subOptions.getState.getParentState = options.getState;

  subOptions.setState = function setState(newVal) {
    var state = options.getState();
    state.val[index] = newVal;
    return options.setState(state);
  };

  return behaviorSelector.create(subOptions);
}

function createListProxy(options) {
  var proxyNode = Object.create(null);

  proxyNode.getItems = function getItems(/*start, length*/) {
    var state = options.getState();
    var retval = state.val.map(function (item, index) {
      return constructProxyItem(options, item, index);
    });
    return retval;
  };

  proxyNode.getDefaultState = getDefaultState.bind(null, options.schemaNode);

  proxyNode.getState = function getState(valOverride, otherOverrides) {
    var state = options.getState();
    return constructState(options.schemaNode, state, objectAssign({}, otherOverrides, { val: valOverride }));
  };

  proxyNode.val = function val(newVal) {
    if (typeof (newVal) === 'undefined') {
      var retval = proxyNode.getState().val;

      return retval.map(function (retvalItem) {
        return retvalItem.val;
      });
      // todo: support multi-level
    }

    var newStateVal = newVal.map(function (item) {
      // todo: implement deeper state construction
      return behaviorSelector.constructState(options.schemaNode.listItem, null, { val: item });
    });

    options.setState({
      val: newStateVal
    });
  };

  //proxyNode.addItem = function addItem(item) {
  //  var state = options.getState();

  //  var proxyItem = constructProxyItem(options, item);
  //  var newItemState = proxyItem.getState(item);
  //  state.val.push(newItemState);
  //  options.setState(state);
  //};

  proxyNode.ignored = function ignored() {
    var ignoredDefinition = options.schemaNode.ignored;
    if (typeof (ignoredDefinition) === 'undefined') {
      return false;
    } else if (typeof (ignoredDefinition) === 'boolean') {
      return ignoredDefinition;
    } else if (typeof (ignoredDefinition) === 'function') {
      return ignoredDefinition(options.getState);
    } else {
      throw new Error('"ignored" definition is invalid');
    }
  };

  proxyNode.required = function required() {
    var requiredDefinition = options.schemaNode.required;
    if (typeof (requiredDefinition) === 'undefined' || proxyNode.ignored()) {
      return false;
    } else if (typeof (requiredDefinition) === 'boolean') {
      return requiredDefinition;
    } else if (typeof (requiredDefinition) === 'function') {
      return requiredDefinition(options.getState);
    } else {
      throw new Error('"required" definition is invalid');
    }
  };

  proxyNode.validate = function validate(ignoreChanges) {
    var retval = {
      isValid: true,
      validationMessage: ''
    };

    var val = proxyNode.val();

    var isEmpty = typeof (val) === 'undefined' || val === null || !val.length;
    if (isEmpty && proxyNode.required()) {
      retval.isValid = false;
      retval.validationMessage = 'Required field';
    } else {
      var itemProxies = proxyNode.getItems();
      for (var itemIndex = 0; itemIndex < itemProxies.length; itemIndex++) {
        var validationResult = itemProxies[itemIndex].validate(ignoreChanges);
        if (!validationResult.isValid) {
          retval.invalidPropertyIndex = itemIndex;
          retval.invalidPropertyResult = validationResult;
          retval.isValid = false;
          break;
        }
      }
    }
    return retval;
  };

  return proxyNode;
}

module.exports = {
  getDefaultState: getDefaultState,
  constructState: constructState,
  deconstructState: deconstructState,
  create: createListProxy
};