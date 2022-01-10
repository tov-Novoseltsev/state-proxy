var objectAssign = require('object-assign');

function getDefaultState(schema) {
  return {
    val: schema.default
  };
}

function constructState(schema, state, overrides) {
  var s = state || getDefaultState(schema);
  var retval = objectAssign({}, s);

  if (typeof overrides !== 'undefined') {
    objectAssign(retval, overrides);
    if (overrides.hasOwnProperty('val') && typeof schema.setDataTransform === 'function') {
      retval.val = schema.setDataTransform(retval.val);
    }
  }

  return retval;
}

function deconstructState(schema, getState) {
  var retval;
  if (typeof schema.val === 'undefined') {
    retval = getState().val;
  } else if (typeof schema.val === 'function') {
    retval = schema.val(getState);
  } else {
    retval = schema.val;
  }

  if (typeof schema.getDataTransform === 'function') {
    retval = schema.getDataTransform(retval);
  }

  return retval;
}

function createDynamicProxy(options) {
  var proxyNode = Object.create(null);

  proxyNode.getDefaultState = getDefaultState.bind(null, options.schemaNode);

  proxyNode.getState = function getState(overrides) {
    var state = options.getState();
    return constructState(options.schemaNode, state, overrides);
  };

  proxyNode.val = function val(newVal) {
    if (arguments.length === 0) {
      if (typeof options.schemaNode.val !== 'undefined') {
        return options.schemaNode.val(options.getState);
      }
      return options.getState().val;
    }

    var state = proxyNode.getState({ val: newVal });
    state.hasChanges = true;
    options.setState(state);
  };

  proxyNode.setTouched = function () {
    var state = proxyNode.getState();
    if (state.hasChanges) {
      state.touched = true;
      options.setState(state);
    }
  };

  proxyNode.ignored = function ignored() {
    var ignoredDefinition = options.schemaNode.ignored;
    if (typeof ignoredDefinition === 'undefined') {
      return false;
    } else if (typeof ignoredDefinition === 'boolean') {
      return ignoredDefinition;
    } else if (typeof ignoredDefinition === 'function') {
      return ignoredDefinition(options.getState, function () { return proxyNode.val(); });
    } else {
      throw new Error('"ignored" definition is invalid');
    }
  };

  proxyNode.required = function required() {
    var requiredDefinition = options.schemaNode.required;
    if (typeof requiredDefinition === 'undefined' || proxyNode.ignored()) {
      return false;
    } else if (typeof requiredDefinition === 'boolean') {
      return requiredDefinition;
    } else if (typeof requiredDefinition === 'function') {
      return requiredDefinition(options.getState, function () { return proxyNode.val(); });
    } else {
      throw new Error('"required" definition is invalid');
    }
  };

  proxyNode.validate = function validate(ignoreChanges) {
    var retval = {
      isValid: true,
      validationMessage: ''
    };
    var state = proxyNode.getState();
    var nodeShouldBeValidated = state.hasChanges || ignoreChanges;

    if (!nodeShouldBeValidated || proxyNode.ignored()) {
      return retval;
    }

    var val = proxyNode.val();

    var isEmpty = typeof (val) === 'undefined' || val === null || val === '' ||
      (val.constructor === Array && !val.length);
    if (isEmpty && proxyNode.required()) {
      retval.isValid = false;
      //retval.requiredValidationViolated = true;
      retval.validationMessage = options.schemaNode.requiredErrorMessage || 'Required field';
    } else {
      var validateDefinition = options.schemaNode.validate;
      if (typeof validateDefinition === 'function') {
        var validationResult = validateDefinition(options.getState, function () { return val; });
        if (typeof validationResult === 'boolean') {
          retval.isValid = validationResult;
        } else {
          retval = validationResult;
        }
      }
    }

    return retval;
  };

  proxyNode.exposeRequiredErrors = function exposeRequiredErrors() {
    var state = proxyNode.getState({ hasChanges: true, touched: true });
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
  create: createDynamicProxy
};
