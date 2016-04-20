var defineCommons = require('./defineCommons');

function stringBehavior(options) {
  var proxyNode = Object.create(null);

  defineCommons(proxyNode, options);

  return proxyNode;
}

module.exports = stringBehavior;
