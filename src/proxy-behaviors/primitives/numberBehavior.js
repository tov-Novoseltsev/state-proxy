var defineCommons = require('./defineCommons');

function numberBehavior(options) {
  var proxyNode = Object.create(null);

  defineCommons(proxyNode, options);

  return proxyNode;
}

module.exports = numberBehavior;
