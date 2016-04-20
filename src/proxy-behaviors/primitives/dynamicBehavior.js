var defineCommons = require('./defineCommons');

function dynamicBehavior(options) {
  var proxyNode = Object.create(null);

  defineCommons(proxyNode, options);

  return proxyNode;
}

module.exports = dynamicBehavior;
