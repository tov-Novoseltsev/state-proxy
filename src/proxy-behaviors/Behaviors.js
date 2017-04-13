var SchemaTypes = require('../SchemaTypes');

var Behaviors = {};

Behaviors[SchemaTypes.dynamic] = require('./primitives/dynamicBehavior');
Behaviors[SchemaTypes.bool] = require('./primitives/boolBehavior');
Behaviors[SchemaTypes.number] = require('./primitives/numberBehavior');
Behaviors[SchemaTypes.string] = require('./primitives/stringBehavior');
Behaviors[SchemaTypes.object] = require('./objectBehavior');
Behaviors[SchemaTypes.list] = require('./listBehavior');

module.exports = Behaviors;