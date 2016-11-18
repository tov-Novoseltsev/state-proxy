!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.StateProxy=e():t.StateProxy=e()}(this,function(){return function(t){function e(a){if(n[a])return n[a].exports;var r=n[a]={exports:{},id:a,loaded:!1};return t[a].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}(function(t){for(var e in t)if(Object.prototype.hasOwnProperty.call(t,e))switch(typeof t[e]){case"function":break;case"object":t[e]=function(e){var n=e.slice(1),a=t[e[0]];return function(t,e,r){a.apply(this,[t,e,r].concat(n))}}(t[e]);break;default:t[e]=t[t[e]]}return t}([function(t,e,n){function a(t,e){var n={};return"undefined"==typeof e.getState&&(n.state=t.getDefaultState(),e.getState=function(){return n.state}),"undefined"==typeof e.setState&&(e.setState=function(t){n.state=t}),t}function r(t,e,n){var r={schemaNode:t,getState:e,setState:n},o=i.create(r);return o.getData=function(){return i.deconstructState(t,e)},o.setData=function(a){n(i.constructState(t,e(),a))},a(o,r)}function o(t,e){var n={isValid:t,validationMessage:""};return t||(n.validationMessage=e),n}var i=n(2);t.exports={create:r,formValidationResult:o,SchemaTypes:n(3)}},function(t,e){function n(t){return{val:t["default"]}}function a(t,e,a,r){var o=e||n(t),i=Object.assign({},o);return"undefined"!=typeof r&&Object.assign(i,r,{val:o.val}),"undefined"!=typeof a&&Object.assign(i,{val:a}),i}function r(t,e){var n;return n="undefined"==typeof t.val?e().val:"function"==typeof t.val?t.val(e):t.val,"function"==typeof t.getDataTransform&&(n=t.getDataTransform(n)),n}function o(t){var e=Object.create(null);return e.getDefaultState=n.bind(null,t.schemaNode),e.getState=function(e,n){var r=t.getState();return a(t.schemaNode,r,e,n)},e.val=function(n){if("undefined"==typeof n)return"undefined"!=typeof t.schemaNode.val?t.schemaNode.val(t.getState):t.getState().val;var a=e.getState(n);a.hasChanges=!0,t.setState(a)},e.ignored=function(){var e=t.schemaNode.ignored;if("undefined"==typeof e)return!1;if("boolean"==typeof e)return e;if("function"==typeof e)return e(t.getState);throw new Error('"ignored" definition is invalid')},e.required=function(){var n=t.schemaNode.required;if("undefined"==typeof n||e.ignored())return!1;if("boolean"==typeof n)return n;if("function"==typeof n)return n(t.getState);throw new Error('"required" definition is invalid')},e.validate=function(n){var a={isValid:!0,validationMessage:""},r=e.getState(),o=r.hasChanges||n;if(!o||e.ignored())return a;var i=e.val(),u="undefined"==typeof i||null===i||""===i||i===[];if(u&&e.required())a.isValid=!1,a.validationMessage="Required field";else{var c=t.schemaNode.validate;if("function"==typeof c){var f=c(t.getState);"boolean"==typeof f?a.isValid=f:a=f}}return a},e.exposeRequiredErrors=function(){var n=e.getState(void 0,{hasChanges:!0});t.setState(n)},e.resetToDefault=function(){var n=e.getDefaultState();t.setState(n)},e}t.exports={getDefaultState:n,constructState:a,deconstructState:r,create:o}},function(t,e,n){function a(t){var e=n(4);if(e.hasOwnProperty(t.type)){var a=e[t.type];return a}throw new Error("ERROR: StateProxy encountered unrecognized schema type: "+t.type)}function r(t){var e=a(t.schemaNode),n=e.create(t);return n.schema=t.schemaNode,n}function o(t){var e=a(t);return e.getDefaultState(t)}function i(t,e,n,r){var o=a(t);return o.constructState(t,e,n,r)}function u(t,e){var n=a(t);return n.deconstructState(t,e)}t.exports={create:r,getDefaultState:o,constructState:i,deconstructState:u}},function(t,e){t.exports={dynamic:void 0,bool:"bool",number:"number",string:"string",object:"object",list:"list"}},function(t,e,n){var a=n(3),r={};r[a.dynamic]=n(1),r[a.bool]=n(7),r[a.number]=n(8),r[a.string]=n(9),r[a.object]=n(6),r[a.list]=n(5),t.exports=r},function(t,e,n){function a(t){return{val:t["default"]||[]}}function r(t,e,n,r){var o=Object.assign({},e||a(t));if("undefined"!=typeof n){var i=n;"function"==typeof t.setDataTransform&&(i=t.setDataTransform(n));var u=i.map(function(e){return c.constructState(t.listItem,void 0,e,r)});Object.assign(o,{val:u})}else if("undefined"!=typeof r){var f=o.val.map(function(e){return c.constructState(t.listItem,e,void 0,r)});Object.assign(o,{val:f})}return o}function o(t,e){var n=e().val.map(function(n){var a=function(){return n};return a.getParentState=e,c.deconstructState(t.listItem,a)});return"function"==typeof t.getDataTransform&&(n=t.getDataTransform(n)),n}function i(t,e,n){var a=Object.create(null);return a.schemaNode=t.schemaNode.listItem,a.getState=function(){var e=t.getState();return e.val[n]},a.getState.getParentState=t.getState,a.setState=function(e){var a=t.getState();return a.val[n]=e,t.setState(a)},c.create(a)}function u(t){var e=Object.create(null);return e.getItems=function(e,n){var a=t.getState(),r=a.val.map(function(e,n){return i(t,e,n)});return r},e.getDefaultState=a.bind(null,t.schemaNode),e.getState=function(e,n){var a=t.getState();return r(t.schemaNode,a,e,n)},e.val=function(n){if("undefined"==typeof n){var a=e.getState().val;return a.map(function(t){return t.val})}var r=n.map(function(e){var n=null;return c.constructState(t.schemaNode.listItem,n,e)});t.setState({val:r})},e.validate=function(t){for(var n={isValid:!0,validationMessage:""},a=e.getItems(),r=0;r<a.length;r++){var o=a[r].validate(t);if(!o.isValid){n.invalidPropertyIndex=r,n.invalidPropertyResult=o,n.isValid=!1;break}}return n},e}var c=n(2);t.exports={getDefaultState:a,constructState:r,deconstructState:o,create:u}},function(t,e,n){function a(t,e){var n=[];t&&(n=Object.keys(t));for(var a=0;a<n.length&&e(n[a],a)!==!0;a++);}function r(t){var e={val:Object.create(null)};return a(t.properties,function(n){var a=t.properties[n];e.val[n]=s.getDefaultState(a)}),e}function o(t,e,n,o){var i=e||r(t),u=Object.assign({},i);if("undefined"!=typeof n||"undefined"!=typeof o){var c=n;"function"==typeof t.setDataTransform&&"undefined"!=typeof n&&(c=t.setDataTransform(n)),Object.assign(u,o,{val:i.val});var f=Object.create(null);a(t.properties,function(e){var n="undefined"!=typeof c?c[e]:void 0,a=t.properties[e],r=i.val[e];f[e]=s.constructState(a,r,n,o)}),Object.assign(u,{val:f})}return u}function i(t,e){var n=Object.create(null);return a(t.properties,function(a){var r=t.properties[a],o=function(){return e().val[a]};o.getParentState=e,n[a]=s.deconstructState(r,o)}),"function"==typeof t.getDataTransform&&(n=t.getDataTransform(n)),n}function u(t,e){var n=Object.create(null);return n.schemaNode=e.schemaNode.properties[t],n.getState=function(){var n=e.getState()||{val:{}};return n.val[t]},n.getState.getParentState=e.getState,n.setState=function(n){var a=e.getState();return a.val[t]=n,e.setState(a)},n}function c(t){var e=Object.create(null);return a(t.schemaNode.properties,function(n){var a=u(n,t);e[n]=s.create(a)}),e}function f(t){var e=Object.create(null);return e.properties=c(t),e.getDefaultState=r.bind(null,t.schemaNode),e.getState=function(e,n){var a=t.getState();return o(t.schemaNode,a,e,n)},e.val=function(n){if("undefined"!=typeof t.schemaNode.val)return"undefined"!=typeof n&&console.log("WARNING: Setting operation for calculated property is not allowed"),t.schemaNode.val(t.getState);if("undefined"==typeof n){var r=Object.create(null);return a(t.schemaNode.properties,function(t){r[t]=e.properties[t].val()}),r}var o=e.getState(n);o.hasChanges=!0,t.setState(o)},e.validate=function(n){var r={isValid:!0,validationMessage:""};return a(t.schemaNode.properties,function(t){var a=e.properties[t].validate(n);if(!a.isValid)return r.invalidPropertyName=t,r.invalidPropertyResult=a,r.isValid=!1,!0}),r},e.exposeRequiredErrors=function(){var n=e.getState(void 0,{hasChanges:!0});t.setState(n)},e.resetToDefault=function(){var n=e.getDefaultState();t.setState(n)},e}var s=n(2);t.exports={getDefaultState:r,constructState:o,deconstructState:i,create:f}},function(t,e,n){var a=n(1);t.exports=a},7,7]))});