var behaviorSelector = require('./behaviorSelector');

function find(arr, f) {
  for(var i = 0; i < arr.length; i++) {
    if(f(arr[i])) {
      return arr[i];
    }
  }

  return undefined;
}

function getDefaultState(schema) {
  return { val: schema.default || [] };
}

function constructState(schema, state, valOverride, otherOverrides) {
  var retval = Object.assign({}, state || getDefaultState(schema));

  if(typeof(valOverride) !== 'undefined'/* && typeof(schema.val) === 'undefined'*/) {
    var val = valOverride;
    if(typeof(schema.setDataTransform) === 'function') {
      val = schema.setDataTransform(valOverride);
    }
    var newState = val.map(function(item) {
      return behaviorSelector.constructState(schema.listItem, undefined, item, otherOverrides);
    });
    Object.assign(retval, { val: newState });
  } else if(typeof(otherOverrides) !== 'undefined') {
    var newStateWithOtherOverrides = retval.val.map(function(subState) {
      return behaviorSelector.constructState(schema.listItem, subState, undefined, otherOverrides);
    });
    Object.assign(retval, { val: newStateWithOtherOverrides });
  }

  return retval;
}

function deconstructState(schema, getState) {
  var retval = getState().val.map(function(stateItem) {
    var childGetState = function() {
      return stateItem;
    };
    childGetState.getParentState = getState;
    return behaviorSelector.deconstructState(schema.listItem, childGetState);
  });

  if(typeof(schema.getDataTransform) === 'function') {
    retval = schema.getDataTransform(retval);
  }

  return retval;
}

function constructProxyItem(options, itemState) {
  var subOptions = Object.create(null);

  var idPropertyName = options.schemaNode.idPropertyName || 'id';
  var id = itemState.val[idPropertyName];
  // if(options.schemaNode.listItem.type === 'object') {
  //   id = itemState[idPropertyName];
  // } else {
  //   // todo: support other types
  // }

  subOptions.schemaNode = options.schemaNode.listItem;
  subOptions.getState = function getState() {
    var state = options.getState();
    return find(state.val, function(item) { return item.val[idPropertyName] == id; });
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

  return behaviorSelector.create(subOptions);
}

function createListProxy(options) {
  var proxyNode = Object.create(null);

  proxyNode.getItems = function getItems(start, length) {
    var state = options.getState();
    var retval = state.val.map(function (item) {
      return constructProxyItem(options, item);
    });
    return retval;
  };

  proxyNode.getDefaultState = getDefaultState.bind(null, options.schemaNode);

  proxyNode.getState = function getState(valOverride, otherOverrides) {
    var state = options.getState();
    return constructState(options.schemaNode, state, valOverride, otherOverrides);
  };

  proxyNode.val = function val(newVal) {
    if(typeof(newVal) === 'undefined') {
      var retval = proxyNode.getState().val;

      return retval.map(function(retvalItem) {
        return retvalItem.val;
      });
      // todo: support multi-level
    }

    var newStateVal = newVal.map(function(item) {
      var getState = null;
      // todo: implement deeper state construction
      // if(options.schemaNode.listItem.type === 'object') {
      //   getState = function() {
      //     find(currentState, function(x) {
      //       return x[idPropertyName] === item[idPropertyName];
      //     });
      //   };
      // }
      return behaviorSelector.constructState(options.schemaNode.listItem, getState, item);
    });

    options.setState({ val: newStateVal });
  };

  proxyNode.addItem = function addItem(item) {
    var state = options.getState();

    var proxyItem = constructProxyItem(options, item);
    var newItemState = proxyItem.getState(item);
    state.val.push(newItemState);
    options.setState(state);
  };

  proxyNode.validate = function validate(ignoreChanges) {
    var retval = { isValid: true, validationMessage: '' };
    var itemProxies = proxyNode.getItems();
    for(var itemIndex = 0; itemIndex < itemProxies.length; itemIndex++) {
      var validationResult = itemProxies[itemIndex].validate(ignoreChanges);
      if(!validationResult.isValid) {
        retval.invalidPropertyIndex = itemIndex;
        retval.invalidPropertyResult = validationResult;
        retval.isValid = false;
        break;
      }
    }
    return retval;
  };

  return proxyNode;
}

module.exports = {
  getDefaultState: getDefaultState,
  constructState: constructState,
  deconstructState: deconstructState,
  create: createListProxy
};
