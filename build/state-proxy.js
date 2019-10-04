!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.StateProxy=e():t.StateProxy=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var a=r[n]={exports:{},id:n,loaded:!1};return t[n].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}(function(t){for(var e in t)if(Object.prototype.hasOwnProperty.call(t,e))switch(typeof t[e]){case"function":break;case"object":t[e]=function(e){var r=e.slice(1),n=t[e[0]];return function(t,e,a){n.apply(this,[t,e,a].concat(r))}}(t[e]);break;default:t[e]=t[t[e]]}return t}([function(t,e,r){function n(t,e){var r={};return"undefined"==typeof e.getState&&(r.state=t.getDefaultState(),e.getState=function(){return r.state}),"undefined"==typeof e.setState&&(e.setState=function(t){r.state=t}),t}function a(t,e,r){var a={schemaNode:t,getState:e,setState:r},o=i.create(a);return o.getData=function(){return i.deconstructState(t,e)},o.setData=function(n){r(i.constructState(t,e(),{val:n}))},n(o,a)}function o(t,e){var r={isValid:t,validationMessage:""};return t||(r.validationMessage=e),r}var i=r(2);t.exports={create:a,formValidationResult:o,SchemaTypes:r(4)}},function(t,e,r){function n(t){return{val:t["default"]}}function a(t,e,r){var a=e||n(t),o=u({},a);return"undefined"!=typeof r&&(u(o,r),r.hasOwnProperty("val")&&"function"==typeof t.setDataTransform&&(o.val=t.setDataTransform(o.val))),o}function o(t,e){var r;return r="undefined"==typeof t.val?e().val:"function"==typeof t.val?t.val(e):t.val,"function"==typeof t.getDataTransform&&(r=t.getDataTransform(r)),r}function i(t){var e=Object.create(null);return e.getDefaultState=n.bind(null,t.schemaNode),e.getState=function(e){var r=t.getState();return a(t.schemaNode,r,e)},e.val=function(r){if(0===arguments.length)return"undefined"!=typeof t.schemaNode.val?t.schemaNode.val(t.getState):t.getState().val;var n=e.getState({val:r});n.hasChanges=!0,t.setState(n)},e.ignored=function(){var e=t.schemaNode.ignored;if("undefined"==typeof e)return!1;if("boolean"==typeof e)return e;if("function"==typeof e)return e(t.getState);throw new Error('"ignored" definition is invalid')},e.required=function(){var r=t.schemaNode.required;if("undefined"==typeof r||e.ignored())return!1;if("boolean"==typeof r)return r;if("function"==typeof r)return r(t.getState);throw new Error('"required" definition is invalid')},e.validate=function(r){var n={isValid:!0,validationMessage:""},a=e.getState(),o=a.hasChanges||r;if(!o||e.ignored())return n;var i=e.val(),u="undefined"==typeof i||null===i||""===i||i.constructor===Array&&!i.length;if(u&&e.required())n.isValid=!1,n.validationMessage=t.schemaNode.requiredErrorMessage||"Required field";else{var f=t.schemaNode.validate;if("function"==typeof f){var c=f(t.getState,i);"boolean"==typeof c?n.isValid=c:n=c}}return n},e.exposeRequiredErrors=function(){var r=e.getState({hasChanges:!0});t.setState(r)},e.resetToDefault=function(){var r=e.getDefaultState();t.setState(r)},e}var u=r(3);t.exports={getDefaultState:n,constructState:a,deconstructState:o,create:i}},function(t,e,r){function n(t){var e=r(5);if(e.hasOwnProperty(t.type)){var n=e[t.type];return n}throw new Error("ERROR: StateProxy encountered unrecognized schema type: "+t.type)}function a(t){var e=n(t.schemaNode),r=e.create(t);return r.schema=t.schemaNode,r}function o(t){var e=n(t);return e.getDefaultState(t)}function i(t,e,r){var a=n(t);return a.constructState(t,e,r)}function u(t,e){var r=n(t);return r.deconstructState(t,e)}t.exports={create:a,getDefaultState:o,constructState:i,deconstructState:u}},function(t,e){/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
"use strict";function r(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}function n(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},r=0;r<10;r++)e["_"+String.fromCharCode(r)]=r;var n=Object.getOwnPropertyNames(e).map(function(t){return e[t]});if("0123456789"!==n.join(""))return!1;var a={};return"abcdefghijklmnopqrst".split("").forEach(function(t){a[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},a)).join("")}catch(o){return!1}}var a=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;t.exports=n()?Object.assign:function(t,e){for(var n,u,f=r(t),c=1;c<arguments.length;c++){n=Object(arguments[c]);for(var s in n)o.call(n,s)&&(f[s]=n[s]);if(a){u=a(n);for(var l=0;l<u.length;l++)i.call(n,u[l])&&(f[u[l]]=n[u[l]])}}return f}},function(t,e){t.exports={dynamic:void 0,bool:"bool",number:"number",string:"string",object:"object",list:"list"}},function(t,e,r){var n=r(4),a={};a[n.dynamic]=r(1),a[n.bool]=r(8),a[n.number]=r(9),a[n.string]=r(10),a[n.object]=r(7),a[n.list]=r(6),t.exports=a},function(t,e,r){function n(t){return{val:t["default"]||[]}}function a(t,e,r){var a=e||n(t),o=f({},a);return"undefined"!=typeof r&&(f(o,r),"undefined"!=typeof r.val?("function"==typeof t.setDataTransform&&(o.val=t.setDataTransform(r.val)),o.val=o.val.map(function(e){var n=f({},r,{val:e});return c.constructState(t.listItem,void 0,n)})):o.val=o.val.map(function(e){return c.constructState(t.listItem,e,r)})),o}function o(t,e){var r=e().val.map(function(r){var n=function(){return r};return n.getParentState=e,c.deconstructState(t.listItem,n)});return"function"==typeof t.getDataTransform&&(r=t.getDataTransform(r)),r}function i(t,e,r){var n=Object.create(null);return n.schemaNode=t.schemaNode.listItem,n.getState=function(){var e=t.getState();return e.val[r]},n.getState.getParentState=t.getState,n.setState=function(e){var n=t.getState();return n.val[r]=e,t.setState(n)},c.create(n)}function u(t){var e=Object.create(null);return e.getItems=function(){var e=t.getState(),r=e.val.map(function(e,r){return i(t,e,r)});return r},e.getDefaultState=n.bind(null,t.schemaNode),e.getState=function(e){var r=t.getState();return a(t.schemaNode,r,e)},e.val=function(r){if("undefined"==typeof r){var n=e.getState().val;return n.map(function(t){return t.val})}var a=r.map(function(e){return c.constructState(t.schemaNode.listItem,null,{val:e})});t.setState({val:a})},e.ignored=function(){var e=t.schemaNode.ignored;if("undefined"==typeof e)return!1;if("boolean"==typeof e)return e;if("function"==typeof e)return e(t.getState);throw new Error('"ignored" definition is invalid')},e.required=function(){var r=t.schemaNode.required;if("undefined"==typeof r||e.ignored())return!1;if("boolean"==typeof r)return r;if("function"==typeof r)return r(t.getState);throw new Error('"required" definition is invalid')},e.validate=function(t){var r={isValid:!0,validationMessage:""},n=e.val(),a="undefined"==typeof n||null===n||!n.length;if(a&&e.required())r.isValid=!1,r.validationMessage="Required field";else for(var o=e.getItems(),i=0;i<o.length;i++){var u=o[i].validate(t);if(!u.isValid){r.invalidPropertyIndex=i,r.invalidPropertyResult=u,r.isValid=!1;break}}return r},e}var f=r(3),c=r(2);t.exports={getDefaultState:n,constructState:a,deconstructState:o,create:u}},function(t,e,r){function n(t,e){var r=[];t&&(r=Object.keys(t));for(var n=0;n<r.length&&e(r[n],n)!==!0;n++);}function a(t){var e={val:{}};return n(t.properties,function(r){var n=t.properties[r];e.val[r]=l.getDefaultState(n)}),e}function o(t,e,r){var o=e||a(t),i=s({},o);if("undefined"!=typeof r){s(i,r);var u={};"undefined"!=typeof r.val?("function"==typeof t.setDataTransform&&(i.val=t.setDataTransform(i.val)),n(t.properties,function(e){var n=t.properties[e],a=o.val[e],f=s({},r,{val:i.val[e]});i.val.hasOwnProperty(e)||delete f.val,u[e]=l.constructState(n,a,f)})):n(t.properties,function(e){var n=t.properties[e],a=o.val[e];u[e]=l.constructState(n,a,r)}),i.val=u}return i}function i(t,e){var r={};return n(t.properties,function(n){var a=t.properties[n],o=function(){return e().val[n]};o.getParentState=e,r[n]=l.deconstructState(a,o)}),"function"==typeof t.getDataTransform&&(r=t.getDataTransform(r)),r}function u(t,e){var r={};return r.schemaNode=e.schemaNode.properties[t],r.getState=function(){var r=e.getState()||{val:{}};return r.val[t]},r.getState.getParentState=e.getState,r.setState=function(r){var n=e.getState();return n.val[t]=r,e.setState(n)},r}function f(t){var e={};return n(t.schemaNode.properties,function(r){var n=u(r,t);e[r]=l.create(n)}),e}function c(t){var e={};return e.properties=f(t),e.getDefaultState=a.bind(null,t.schemaNode),e.getState=function(e){var r=t.getState();return o(t.schemaNode,r,e)},e.val=function(r){if("undefined"!=typeof t.schemaNode.val)return"undefined"!=typeof r&&console.log("WARNING: Setting operation for calculated property is not allowed"),t.schemaNode.val(t.getState);if("undefined"==typeof r){var a={};return n(t.schemaNode.properties,function(t){a[t]=e.properties[t].val()}),a}var o=e.getState({val:r});o.hasChanges=!0,t.setState(o)},e.validate=function(r){var a={isValid:!0,validationMessage:""};return n(t.schemaNode.properties,function(t){var n=e.properties[t].validate(r);if(!n.isValid)return a.invalidPropertyName=t,a.invalidPropertyResult=n,a.isValid=!1,!0}),a},e.exposeRequiredErrors=function(){var r=e.getState({hasChanges:!0});t.setState(r)},e.resetToDefault=function(){var r=e.getDefaultState();t.setState(r)},e}var s=r(3),l=r(2);t.exports={getDefaultState:a,constructState:o,deconstructState:i,create:c}},function(t,e,r){var n=r(1);t.exports=n},8,8]))});