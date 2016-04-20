var defineCommons = require('./defineCommons');

function boolBehavior(options) {
  var proxyNode = Object.create(null);

  defineCommons(proxyNode, options);

  return proxyNode;
}

module.exports = boolBehavior;
