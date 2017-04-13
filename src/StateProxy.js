var behaviorSelector = require('./proxy-behaviors/behaviorSelector');

function provideDefaultStateStorage(proxyNode, options) {
  var internalState = {};
  if (typeof options.getState === 'undefined') {
    internalState.state = proxyNode.getDefaultState();
    options.getState = function getState() {
      return internalState.state;
    };
  }
  if (typeof options.setState === 'undefined') {
    options.setState = function setState(newState) {
      internalState.state = newState;
    };
  }
  return proxyNode;
}

function create(schemaNode, getState, setState) {
  var rootOptions = {
    schemaNode: schemaNode,
    getState: getState,
    setState: setState
  };

  var rootProxy = behaviorSelector.create(rootOptions);
  rootProxy.getData = function getData() {
    return behaviorSelector.deconstructState(schemaNode, getState);
  };

  rootProxy.setData = function setData(data) {
    setState(behaviorSelector.constructState(schemaNode, getState(), data));
  };

  return provideDefaultStateStorage(rootProxy, rootOptions);
}

function formValidationResult(condition, validationMessage) {
  var retval = {
    isValid: condition,
    validationMessage: ''
  };
  if (!condition) {
    retval.validationMessage = validationMessage;
  }
  return retval;
}

module.exports = {
  create: create,
  formValidationResult: formValidationResult,
  SchemaTypes: require('./SchemaTypes')
};