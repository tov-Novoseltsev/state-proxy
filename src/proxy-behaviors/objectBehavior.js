var executeBehavior = require('./executeBehavior');

function constructSubOptions(propertyName, options) {
  var retval = Object.create(null);
  retval.schemaNode = options.schemaNode.properties[propertyName];
  retval.getState = function getState() {
    var state = options.getState() || { val: {} };
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

function constructProxyProperties(propertyNames, options) {
  var retval = Object.create(null);
  for(var i=0; i < propertyNames.length; i++) {
    var propName = propertyNames[i];
    var subOptions = constructSubOptions(propName, options);
    retval[propName] = executeBehavior(subOptions);
  }
  return retval;
}

function objectBehavior(options) {
  var proxyNode = Object.create(null);

  var propertyNames = [];
  if(options.schemaNode.properties) {
    propertyNames = Object.keys(options.schemaNode.properties);
  }

  proxyNode.properties = constructProxyProperties(propertyNames, options);

  proxyNode.getDefaultState = function getDefaultState() {
    var defaultState = { val: Object.create(null) };

    for(var i=0; i < propertyNames.length; i++) {
      var propName = propertyNames[i];
      defaultState.val[propName] = proxyNode.properties[propName].getDefaultState();
    }

    return defaultState;
  };

  proxyNode.getState = function getState(valOverrides, otherOverrides) {
    var state = options.getState() || { val: {} };
    var retval = Object.assign({}, state);

    if(typeof(valOverrides) !== 'undefined' || typeof(otherOverrides) !== 'undefined') {
      Object.assign(retval, otherOverrides, { val: state.val });

      var valState = Object.create(null);
      for(var i=0; i < propertyNames.length; i++) {
        var propName = propertyNames[i];
        var childValOverride = typeof(valOverrides) !== 'undefined' ?
          valOverrides[propName] : undefined;
        valState[propName] = proxyNode.properties[propName].getState(childValOverride, otherOverrides);
      }

      Object.assign(retval, { val: valState });
    }

    return retval;
  };

  proxyNode.val = function val(newVal) {
    if(typeof options.schemaNode.val !== 'undefined') {
      if(typeof(newVal) !== 'undefined') {
        console.log('WARNING: Setting operation for calculated property is not allowed');
      }
      return options.schemaNode.val(options.getState);
    }

    if(typeof(newVal) === 'undefined') {
      var retval = Object.create(null);
      for(var i=0; i < propertyNames.length; i++) {
        var propName = propertyNames[i];
        retval[propName] = proxyNode.properties[propName].val();
      }
      return retval;
    }

    var state = proxyNode.getState(newVal);
    state.hasChanges = true;
    options.setState(state);
  };

  proxyNode.validate = function validate(ignoreVirgin) {
    var retval = { isValid: true, validationMessage: '' };

    for(var i=0; i < propertyNames.length; i++) {
      var propName = propertyNames[i];
      var isValid = proxyNode.properties[propName].validate(ignoreVirgin).isValid;
      if(!isValid) {
        retval.isValid = false;
        break;
      }
    }

    return retval;
  };

  proxyNode.exposeRequiredErrors = function exposeRequiredErrors() {
    var state = proxyNode.getState(undefined, { hasChanges: true });
    options.setState(state);
  };

  return proxyNode;
}

module.exports = objectBehavior;
