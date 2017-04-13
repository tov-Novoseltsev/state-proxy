var objectAssign = require('object-assign');

function getDefaultState(schema) {
  return {
    val: schema.default
  };
}

function constructState(schema, state, valOverride, otherOverrides) {
  var s = state || getDefaultState(schema);
  var retval = objectAssign({}, s);

  if (typeof otherOverrides !== 'undefined') {
    objectAssign(retval, otherOverrides, {
      val: s.val
    });
  }

  if (typeof valOverride !== 'undefined') {
    var val = valOverride;

    if (typeof schema.setDataTransform === 'function') {
      val = schema.setDataTransform(valOverride);
    }

    objectAssign(retval, {
      val: val
    });
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

  proxyNode.getState = function getState(valOverride, otherOverrides) {
    var state = options.getState();
    return constructState(options.schemaNode, state, valOverride, otherOverrides);
  };

  proxyNode.val = function val(newVal) {
    if (typeof newVal === 'undefined') {
      if (typeof options.schemaNode.val !== 'undefined') {
        return options.schemaNode.val(options.getState);
      }
      return options.getState().val;
    }

    var state = proxyNode.getState(newVal);
    state.hasChanges = true;
    options.setState(state);
  };

  proxyNode.ignored = function ignored() {
    var ignoredDefinition = options.schemaNode.ignored;
    if (typeof ignoredDefinition === 'undefined') {
      return false;
    } else if (typeof ignoredDefinition === 'boolean') {
      return ignoredDefinition;
    } else if (typeof ignoredDefinition === 'function') {
      return ignoredDefinition(options.getState);
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
      retval.validationMessage = 'Required field';
    } else {
      var validateDefinition = options.schemaNode.validate;
      if (typeof validateDefinition === 'function') {
        var validationResult = validateDefinition(options.getState);
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
    var state = proxyNode.getState(undefined, {
      hasChanges: true
    });
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