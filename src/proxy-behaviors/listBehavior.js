//todo: to be implemented

function listBehavior(options) {
  var proxyNode = Object.create(null);

  proxyNode.getDefaultState = function() {
    return options.schemaNode.default;
  };



  proxyNode.validate = function() {
  };

  return proxyNode;
}

module.exports = listBehavior;
