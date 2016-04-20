function executeBehavior(options) {
  var proxyBehaviors = require('./Behaviors');

  var proxyNode = Object.create(null);
  if(proxyBehaviors.hasOwnProperty(options.schemaNode.type)) {
    var proxyBehavior = proxyBehaviors[options.schemaNode.type];
    proxyNode = proxyBehavior(options);
  } else {
    throw new Error('ERROR: StateProxy encountered unrecognized schema type: ' +
      options.schemaNode.type);
  }

  proxyNode.schema = options.schemaNode;

  return proxyNode;
}

module.exports = executeBehavior;
