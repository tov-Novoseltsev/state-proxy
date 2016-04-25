var executeBehavior = require('./executeBehavior');

function find(arr, f) {
  for(var i = 0; i < arr.length; i++) {
    if(f(arr[i])) {
      return arr[i];
    }
  }

  return undefined;
}

function constructProxyItem(options, itemState) {
  var subOptions = Object.create(null);

  var idPropertyName = options.schemaNode.idPropertyName || 'id';
  var id = itemState[idPropertyName].val;

  subOptions.schemaNode = options.schemaNode.listItem;
  subOptions.getState = function getState() {
    var state = options.getState();
    return find(state.val, function(item) { return item.val[idPropertyName].val == id; });
  };
  subOptions.getState.getParentState = options.getState;

  subOptions.setState = function setState(newVal) {
    var state = options.getState();
    var updatedVal = state.val.map(function(item) {
      return item.val[idPropertyName].val === id ? newVal : item;
    });
    state.val = updatedVal;
    return options.setState(state);
  };

  return executeBehavior(subOptions);
}

function listBehavior(options) {
  var proxyNode = Object.create(null);

  proxyNode.getItems = function getItems(start, length) {
    var state = options.getState();
    var retval = state.val.map(function (item) {
      return constructProxyItem(options, item.val);
    });
    return retval;
  };

  proxyNode.getDefaultState = function getDefaultState() {
    // var d = options.schemaNode.default;
    // if(typeof(d) !== 'undefined') {
    //   // todo: process default
    // }
    return {val:[]};
  };

  proxyNode.val = function val(newVal) {
    if(typeof(newVal) === 'undefined') {
      return proxyNode.getItems().map(function(itemProxy) {
        return itemProxy.val();
      });
    }
  };

  proxyNode.addItem = function addItem(item) {
    var state = options.getState();

    var proxyItem = constructProxyItem(options, item);
    var newItemState = proxyItem.getState(item);
    state.val.push(newItemState);
    options.setState(state);
  };

  proxyNode.validate = function validate() {
  };

  return proxyNode;
}

module.exports = listBehavior;
