function getBehavior(schema) {
  var behaviors = require('./Behaviors');

  if (behaviors.hasOwnProperty(schema.type)) {
    var behavior = behaviors[schema.type];
    return behavior;
  } else {
    throw new Error('ERROR: StateProxy encountered unrecognized schema type: ' +
      schema.type);
  }
}

function create(nodeOptions) {
  var behavior = getBehavior(nodeOptions.schemaNode);
  var proxyNode = behavior.create(nodeOptions);

  proxyNode.schema = nodeOptions.schemaNode;

  return proxyNode;
}

function getDefaultState(schema) {
  var behavior = getBehavior(schema);
  return behavior.getDefaultState(schema);
}

function constructState(schema, state, overrides) {
  var behavior = getBehavior(schema);
  return behavior.constructState(schema, state, overrides);
}

function deconstructState(schema, getState) {
  var behavior = getBehavior(schema);
  return behavior.deconstructState(schema, getState);
}

module.exports = {
  create: create,
  getDefaultState: getDefaultState,
  constructState: constructState,
  deconstructState: deconstructState
};