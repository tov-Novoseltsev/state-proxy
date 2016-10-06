'use strict';

var behaviorSelector = require('./behaviorSelector');

describe('behaviorSelector', function() {
  it('should generate proxyNode in case type was not provided (dynamic type)', function() {
    var schema = {};
    var proxyNode = behaviorSelector.create({ schemaNode: schema });
    expect(proxyNode).toBeDefined();
  });

  it('should expose the schema to proxyNode', function() {
    var schema = {}; // dynamic type
    var proxyNode = behaviorSelector.create({ schemaNode: schema });
    expect(proxyNode.schema).toBe(schema);
  });

  it('throws an exception in case of unknown type in schema', function() {
    var schema = {
      type: 'FooBar'
    };
    expect(function() {
      behaviorSelector.create({ schemaNode: schema });
    }).toThrow(new Error('ERROR: StateProxy encountered unrecognized schema type: FooBar'));
  });
});
