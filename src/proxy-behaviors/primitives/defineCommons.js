function defineCommons(proxyNode, options) {
  proxyNode.getState = function getState(valOverride, otherOverrides) {
    var state = options.getState();
    var retval = Object.assign({}, state);

    if(typeof(otherOverrides) !== 'undefined') {
      Object.assign(retval, otherOverrides, { val: state.val });
    }

    if(typeof(valOverride) !== 'undefined' && typeof(options.schemaNode.val) === 'undefined') {
      Object.assign(retval, { val: valOverride });
    }

    return retval;
  };

  proxyNode.getDefaultState = function getDefaultState() {
    return {
      val: options.schemaNode.default
    };
  };

  proxyNode.val = function val(newVal) {
    if(typeof (options.schemaNode.val) !== 'undefined') {
      if(typeof(newVal) !== 'undefined') {
        console.log('WARNING: Setting operation for calculated property is not allowed');
      }
      return options.schemaNode.val(options.getState);
    }

    if(typeof(newVal) === 'undefined') {
      return options.getState().val;
    }

    var state = proxyNode.getState(newVal);
    state.hasChanges = true;
    options.setState(state);
  };

  proxyNode.ignored = function ignored() {
    var ignoredDefinition = options.schemaNode.ignored;
    if(typeof(ignoredDefinition) === 'undefined') {
      return false;
    }	else if(typeof(ignoredDefinition) === 'boolean') {
      return ignoredDefinition;
    }	else if(typeof(ignoredDefinition) === 'function') {
      return ignoredDefinition(options.getState);
    } else {
      throw new Error('"ignored" definition is invalid');
    }
  };

  proxyNode.required = function required() {
    var requiredDefinition = options.schemaNode.required;
    if(typeof(requiredDefinition) === 'undefined' || proxyNode.ignored()) {
      return false;
    }	else if(typeof(requiredDefinition) === 'boolean') {
      return requiredDefinition;
    }	else if(typeof(requiredDefinition) === 'function') {
      return requiredDefinition(options.getState);
    } else {
      throw new Error('"required" definition is invalid');
    }
  };

  proxyNode.validate = function validate(ignoreChanges) {
    var retval = { isValid: true, validationMessage: '' };

    var val = proxyNode.val();
    var state = proxyNode.getState();

    if(!state.hasChanges && !ignoreChanges) {
      return retval;
    }

    var isEmpty = typeof(val) === 'undefined' || val === null || val === '';
    if((state.hasChanges || ignoreChanges) && isEmpty && proxyNode.required()) {
      retval.isValid = false;
      //retval.requiredValidationViolated = true;
      retval.validationMessage = 'Required field';
    } else {
      var validateDefinition = options.schemaNode.validate;
      if(typeof(validateDefinition) === 'function') {
        var validationResult = validateDefinition(options.getState);
        if(typeof(validationResult) === 'boolean') {
          retval.isValid = validationResult;
        } else {
          retval = validationResult;
        }
      }
    }

    return retval;
  };

  proxyNode.exposeRequiredErrors = function exposeRequiredErrors() {
    var state = proxyNode.getState(undefined, { hasChanges: true });
    options.setState(state);
  };

  proxyNode.resetToDefault = function resetToDefault() {
    var state = proxyNode.getDefaultState();
    options.setState(state);
  };
}

module.exports = defineCommons;
