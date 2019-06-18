(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["StateProxy"] = factory();
	else
		root["StateProxy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var behaviorSelector = __webpack_require__(1);

	function provideDefaultStateStorage(proxyNode, options) {
	  var internalState = {};
	  if (typeof options.getState === 'undefined') {
	    internalState.state = proxyNode.getDefaultState();
	    options.getState = function getState() {
	      return internalState.state;
	    };
	  }
	  if (typeof options.setState === 'undefined') {
	    options.setState = function setState(newState) {
	      internalState.state = newState;
	    };
	  }
	  return proxyNode;
	}

	function create(schemaNode, getState, setState) {
	  var rootOptions = {
	    schemaNode: schemaNode,
	    getState: getState,
	    setState: setState
	  };

	  var rootProxy = behaviorSelector.create(rootOptions);
	  rootProxy.getData = function getData() {
	    return behaviorSelector.deconstructState(schemaNode, getState);
	  };

	  rootProxy.setData = function setData(data) {
	    setState(behaviorSelector.constructState(schemaNode, getState(), { val: data }));
	  };

	  return provideDefaultStateStorage(rootProxy, rootOptions);
	}

	function formValidationResult(condition, validationMessage) {
	  var retval = {
	    isValid: condition,
	    validationMessage: ''
	  };
	  if (!condition) {
	    retval.validationMessage = validationMessage;
	  }
	  return retval;
	}

	module.exports = {
	  create: create,
	  formValidationResult: formValidationResult,
	  SchemaTypes: __webpack_require__(3)
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	function getBehavior(schema) {
	  var behaviors = __webpack_require__(2);

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var SchemaTypes = __webpack_require__(3);

	var Behaviors = {};

	Behaviors[SchemaTypes.dynamic] = __webpack_require__(4);
	Behaviors[SchemaTypes.bool] = __webpack_require__(6);
	Behaviors[SchemaTypes.number] = __webpack_require__(7);
	Behaviors[SchemaTypes.string] = __webpack_require__(8);
	Behaviors[SchemaTypes.object] = __webpack_require__(9);
	Behaviors[SchemaTypes.list] = __webpack_require__(10);

	module.exports = Behaviors;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	  dynamic: undefined,
	  bool: 'bool',
	  number: 'number',
	  string: 'string',
	  object: 'object',
	  list: 'list'
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var objectAssign = __webpack_require__(5);

	function getDefaultState(schema) {
	  return {
	    val: schema.default
	  };
	}

	function constructState(schema, state, overrides) {
	  var s = state || getDefaultState(schema);
	  var retval = objectAssign({}, s);

	  if (typeof overrides !== 'undefined') {
	    objectAssign(retval, overrides);
	    if (overrides.hasOwnProperty('val') && typeof schema.setDataTransform === 'function') {
	      retval.val = schema.setDataTransform(retval.val);
	    }
	  }

	  return retval;
	}

	function deconstructState(schema, getState) {
	  var retval;
	  if (typeof schema.val === 'undefined') {
	    retval = getState().val;
	  } else if (typeof schema.val === 'function') {
	    retval = schema.val(getState);
	  } else {
	    retval = schema.val;
	  }

	  if (typeof schema.getDataTransform === 'function') {
	    retval = schema.getDataTransform(retval);
	  }

	  return retval;
	}

	function createDynamicProxy(options) {
	  var proxyNode = Object.create(null);

	  proxyNode.getDefaultState = getDefaultState.bind(null, options.schemaNode);

	  proxyNode.getState = function getState(overrides) {
	    var state = options.getState();
	    return constructState(options.schemaNode, state, overrides);
	  };

	  proxyNode.val = function val(newVal) {
	    if (arguments.length === 0) {
	      if (typeof options.schemaNode.val !== 'undefined') {
	        return options.schemaNode.val(options.getState);
	      }
	      return options.getState().val;
	    }

	    var state = proxyNode.getState({ val: newVal });
	    state.hasChanges = true;
	    options.setState(state);
	  };

	  proxyNode.ignored = function ignored() {
	    var ignoredDefinition = options.schemaNode.ignored;
	    if (typeof ignoredDefinition === 'undefined') {
	      return false;
	    } else if (typeof ignoredDefinition === 'boolean') {
	      return ignoredDefinition;
	    } else if (typeof ignoredDefinition === 'function') {
	      return ignoredDefinition(options.getState);
	    } else {
	      throw new Error('"ignored" definition is invalid');
	    }
	  };

	  proxyNode.required = function required() {
	    var requiredDefinition = options.schemaNode.required;
	    if (typeof requiredDefinition === 'undefined' || proxyNode.ignored()) {
	      return false;
	    } else if (typeof requiredDefinition === 'boolean') {
	      return requiredDefinition;
	    } else if (typeof requiredDefinition === 'function') {
	      return requiredDefinition(options.getState);
	    } else {
	      throw new Error('"required" definition is invalid');
	    }
	  };

	  proxyNode.validate = function validate(ignoreChanges) {
	    var retval = {
	      isValid: true,
	      validationMessage: ''
	    };
	    var state = proxyNode.getState();
	    var nodeShouldBeValidated = state.hasChanges || ignoreChanges;

	    if (!nodeShouldBeValidated || proxyNode.ignored()) {
	      return retval;
	    }

	    var val = proxyNode.val();

	    var isEmpty = typeof (val) === 'undefined' || val === null || val === '' ||
	      (val.constructor === Array && !val.length);
	    if (isEmpty && proxyNode.required()) {
	      retval.isValid = false;
	      //retval.requiredValidationViolated = true;
	      retval.validationMessage = options.schemaNode.requiredErrorMessage || 'Required field';
	    } else {
	      var validateDefinition = options.schemaNode.validate;
	      if (typeof validateDefinition === 'function') {
	        var validationResult = validateDefinition(options.getState);
	        if (typeof validationResult === 'boolean') {
	          retval.isValid = validationResult;
	        } else {
	          retval = validationResult;
	        }
	      }
	    }

	    return retval;
	  };

	  proxyNode.exposeRequiredErrors = function exposeRequiredErrors() {
	    var state = proxyNode.getState({ hasChanges: true });
	    options.setState(state);
	  };

	  proxyNode.resetToDefault = function resetToDefault() {
	    var state = proxyNode.getDefaultState();
	    options.setState(state);
	  };

	  return proxyNode;
	}

	module.exports = {
	  getDefaultState: getDefaultState,
	  constructState: constructState,
	  deconstructState: deconstructState,
	  create: createDynamicProxy
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var dynamicBehavior = __webpack_require__(4);

	module.exports = dynamicBehavior;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var dynamicBehavior = __webpack_require__(4);

	module.exports = dynamicBehavior;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var dynamicBehavior = __webpack_require__(4);

	module.exports = dynamicBehavior;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var objectAssign = __webpack_require__(5),
	  behaviorSelector = __webpack_require__(1);

	function forEachProperty(propertiesDefinitionObject, func) {
	  var propertyNames = [];
	  if (propertiesDefinitionObject) {
	    propertyNames = Object.keys(propertiesDefinitionObject);
	  }
	  for (var i = 0; i < propertyNames.length; i++) {
	    if (func(propertyNames[i], i) === true) {
	      break;
	    }
	  }
	}

	function getDefaultState(schema) {
	  var defaultState = {
	    val: {}
	  };

	  forEachProperty(schema.properties, function (prop) {
	    var childSchema = schema.properties[prop];
	    defaultState.val[prop] = behaviorSelector.getDefaultState(childSchema);
	  });

	  return defaultState;
	}

	function constructState(schema, stateArg, overrides) {
	  var state = stateArg || getDefaultState(schema);
	  var retval = objectAssign({}, state);

	  if (typeof overrides !== 'undefined') {
	    objectAssign(retval, overrides);
	    var valState = {};
	    if (typeof overrides.val !== 'undefined') {
	      if (typeof schema.setDataTransform === 'function') {
	        retval.val = schema.setDataTransform(retval.val);
	      }

	      forEachProperty(schema.properties, function (prop) {
	        var childSchema = schema.properties[prop];
	        var childState = state.val[prop];
	        var childOverrides = objectAssign({}, overrides, { val: retval.val[prop] });
	        if (!retval.val.hasOwnProperty(prop)) {
	          delete childOverrides.val;
	        }

	        valState[prop] = behaviorSelector.constructState(childSchema, childState, childOverrides);
	      });
	    } else {
	      forEachProperty(schema.properties, function (prop) {
	        var childSchema = schema.properties[prop];
	        var childState = state.val[prop];
	        valState[prop] = behaviorSelector.constructState(childSchema, childState, overrides);
	      });
	    }
	    retval.val = valState;
	  }

	  return retval;
	}

	function deconstructState(schema, getState) {
	  var retval = {};

	  forEachProperty(schema.properties, function (prop) {
	    var childSchema = schema.properties[prop];
	    var childGetState = function () {
	      return getState().val[prop];
	    };
	    childGetState.getParentState = getState;
	    retval[prop] = behaviorSelector.deconstructState(childSchema, childGetState);
	  });

	  if (typeof (schema.getDataTransform) === 'function') {
	    retval = schema.getDataTransform(retval);
	  }

	  return retval;
	}

	function constructSubOptions(propertyName, options) {
	  var retval = {};
	  retval.schemaNode = options.schemaNode.properties[propertyName];
	  retval.getState = function getState() {
	    var state = options.getState() || {
	      val: {}
	    };
	    return state.val[propertyName];
	  };
	  retval.getState.getParentState = options.getState;
	  retval.setState = function setState(newVal) {
	    var state = options.getState();
	    state.val[propertyName] = newVal;
	    return options.setState(state);
	  };
	  return retval;
	}

	function constructProxyProperties(options) {
	  var retval = {};
	  forEachProperty(options.schemaNode.properties, function (prop) {
	    var subOptions = constructSubOptions(prop, options);
	    retval[prop] = behaviorSelector.create(subOptions);
	  });
	  return retval;
	}

	function createObjectProxy(options) {
	  var proxyNode = {};

	  proxyNode.properties = constructProxyProperties(options);

	  proxyNode.getDefaultState = getDefaultState.bind(null, options.schemaNode);

	  proxyNode.getState = function getState(overrides) {
	    var state = options.getState();
	    return constructState(options.schemaNode, state, overrides);
	  };

	  proxyNode.val = function val(newVal) {
	    if (typeof options.schemaNode.val !== 'undefined') {
	      if (typeof (newVal) !== 'undefined') {
	        console.log('WARNING: Setting operation for calculated property is not allowed');
	      }
	      return options.schemaNode.val(options.getState);
	    }

	    if (typeof (newVal) === 'undefined') {
	      var retval = {};
	      forEachProperty(options.schemaNode.properties, function (prop) {
	        retval[prop] = proxyNode.properties[prop].val();
	      });
	      return retval;
	    }

	    var state = proxyNode.getState({ val: newVal });

	    state.hasChanges = true;
	    options.setState(state);
	  };

	  proxyNode.validate = function validate(ignoreChanges) {
	    var retval = {
	      isValid: true,
	      validationMessage: ''
	    };

	    forEachProperty(options.schemaNode.properties, function (prop) {
	      var validationResult = proxyNode.properties[prop].validate(ignoreChanges);
	      if (!validationResult.isValid) {
	        retval.invalidPropertyName = prop;
	        retval.invalidPropertyResult = validationResult;
	        retval.isValid = false;
	        return true;
	      }
	    });

	    return retval;
	  };

	  proxyNode.exposeRequiredErrors = function exposeRequiredErrors() {
	    var state = proxyNode.getState({ hasChanges: true });
	    options.setState(state);
	  };

	  proxyNode.resetToDefault = function resetToDefault() {
	    var state = proxyNode.getDefaultState();
	    options.setState(state);
	  };

	  return proxyNode;
	}

	module.exports = {
	  getDefaultState: getDefaultState,
	  constructState: constructState,
	  deconstructState: deconstructState,
	  create: createObjectProxy
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var objectAssign = __webpack_require__(5),
	  behaviorSelector = __webpack_require__(1);

	function getDefaultState(schema) {
	  return {
	    val: schema.default || []
	  };
	}

	function constructState(schema, stateArg, overrides) {
	  var state = stateArg || getDefaultState(schema);
	  var retval = objectAssign({}, state);

	  if (typeof overrides !== 'undefined') {
	    objectAssign(retval, overrides);
	    if (typeof overrides.val !== 'undefined') {
	      if (typeof schema.setDataTransform === 'function') {
	        retval.val = schema.setDataTransform(overrides.val);
	      }

	      retval.val = retval.val.map(function (item) {
	        var subOverrides = objectAssign({}, overrides, { val: item });
	        return behaviorSelector.constructState(schema.listItem, undefined, subOverrides);
	      });
	    } else {
	      retval.val = retval.val.map(function (subState) {
	        return behaviorSelector.constructState(schema.listItem, subState, overrides);
	      });
	    }
	  }

	  // if (typeof (valOverride) !== 'undefined' /* && typeof(schema.val) === 'undefined'*/ ) {
	  //   var val = valOverride;
	  //   if (typeof (schema.setDataTransform) === 'function') {
	  //     val = schema.setDataTransform(valOverride);
	  //   }
	  //   var newState = val.map(function (item) {
	  //     return behaviorSelector.constructState(schema.listItem, undefined, item, otherOverrides);
	  //   });
	  //   objectAssign(retval, {
	  //     val: newState
	  //   });
	  // } else if (typeof (otherOverrides) !== 'undefined') {
	  //   var newStateWithOtherOverrides = retval.val.map(function (subState) {
	  //     return behaviorSelector.constructState(schema.listItem, subState, undefined, otherOverrides);
	  //   });
	  //   objectAssign(retval, otherOverrides, {
	  //     val: newStateWithOtherOverrides
	  //   });
	  // }

	  return retval;
	}

	function deconstructState(schema, getState) {
	  var retval = getState().val.map(function (stateItem) {
	    var childGetState = function () {
	      return stateItem;
	    };
	    childGetState.getParentState = getState;
	    return behaviorSelector.deconstructState(schema.listItem, childGetState);
	  });

	  if (typeof (schema.getDataTransform) === 'function') {
	    retval = schema.getDataTransform(retval);
	  }

	  return retval;
	}

	function constructProxyItem(options, itemState, index) {
	  var subOptions = Object.create(null);

	  subOptions.schemaNode = options.schemaNode.listItem;
	  subOptions.getState = function getState() {
	    var state = options.getState();
	    return state.val[index];
	  };
	  subOptions.getState.getParentState = options.getState;

	  subOptions.setState = function setState(newVal) {
	    var state = options.getState();
	    state.val[index] = newVal;
	    return options.setState(state);
	  };

	  return behaviorSelector.create(subOptions);
	}

	function createListProxy(options) {
	  var proxyNode = Object.create(null);

	  proxyNode.getItems = function getItems(/*start, length*/) {
	    var state = options.getState();
	    var retval = state.val.map(function (item, index) {
	      return constructProxyItem(options, item, index);
	    });
	    return retval;
	  };

	  proxyNode.getDefaultState = getDefaultState.bind(null, options.schemaNode);

	  proxyNode.getState = function getState(overrides) {
	    var state = options.getState();
	    return constructState(options.schemaNode, state, overrides);
	  };

	  proxyNode.val = function val(newVal) {
	    if (typeof (newVal) === 'undefined') {
	      var retval = proxyNode.getState().val;

	      return retval.map(function (retvalItem) {
	        return retvalItem.val;
	      });
	      // todo: support multi-level
	    }

	    var newStateVal = newVal.map(function (item) {
	      // todo: implement deeper state construction
	      return behaviorSelector.constructState(options.schemaNode.listItem, null, { val: item });
	    });

	    options.setState({
	      val: newStateVal
	    });
	  };

	  //proxyNode.addItem = function addItem(item) {
	  //  var state = options.getState();

	  //  var proxyItem = constructProxyItem(options, item);
	  //  var newItemState = proxyItem.getState(item);
	  //  state.val.push(newItemState);
	  //  options.setState(state);
	  //};

	  proxyNode.ignored = function ignored() {
	    var ignoredDefinition = options.schemaNode.ignored;
	    if (typeof (ignoredDefinition) === 'undefined') {
	      return false;
	    } else if (typeof (ignoredDefinition) === 'boolean') {
	      return ignoredDefinition;
	    } else if (typeof (ignoredDefinition) === 'function') {
	      return ignoredDefinition(options.getState);
	    } else {
	      throw new Error('"ignored" definition is invalid');
	    }
	  };

	  proxyNode.required = function required() {
	    var requiredDefinition = options.schemaNode.required;
	    if (typeof (requiredDefinition) === 'undefined' || proxyNode.ignored()) {
	      return false;
	    } else if (typeof (requiredDefinition) === 'boolean') {
	      return requiredDefinition;
	    } else if (typeof (requiredDefinition) === 'function') {
	      return requiredDefinition(options.getState);
	    } else {
	      throw new Error('"required" definition is invalid');
	    }
	  };

	  proxyNode.validate = function validate(ignoreChanges) {
	    var retval = {
	      isValid: true,
	      validationMessage: ''
	    };

	    var val = proxyNode.val();

	    var isEmpty = typeof (val) === 'undefined' || val === null || !val.length;
	    if (isEmpty && proxyNode.required()) {
	      retval.isValid = false;
	      retval.validationMessage = 'Required field';
	    } else {
	      var itemProxies = proxyNode.getItems();
	      for (var itemIndex = 0; itemIndex < itemProxies.length; itemIndex++) {
	        var validationResult = itemProxies[itemIndex].validate(ignoreChanges);
	        if (!validationResult.isValid) {
	          retval.invalidPropertyIndex = itemIndex;
	          retval.invalidPropertyResult = validationResult;
	          retval.isValid = false;
	          break;
	        }
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


/***/ }
/******/ ])
});
;