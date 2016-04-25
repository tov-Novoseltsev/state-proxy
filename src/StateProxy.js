var executeBehavior = require('./proxy-behaviors/executeBehavior');

function provideDefaultStateStorage(proxyNode, options) {
  var internalState = {};
  if(typeof options.getState === 'undefined') {
    internalState.state = proxyNode.getDefaultState();
    options.getState = function getState() {
      return internalState.state;
    };
  }
  if(typeof options.setState === 'undefined') {
    options.setState = function setState(newState) {
      internalState.state = newState;
    };
  }
  return proxyNode;
}

function create(schemaNode, getState, setState) {
  var options = {
    schemaNode: schemaNode,
    getState: getState,
    setState: setState
  };

  var proxyNode = executeBehavior(options);
  return provideDefaultStateStorage(proxyNode, options);
}

module.exports = {
  create: create,
  SchemaTypes: require('./SchemaTypes')
};
