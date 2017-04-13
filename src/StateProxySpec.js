'use strict';

var StateProxy = require('./StateProxy');

describe('StateProxy', function () {
  describe('dynamic type', function () {

    describe('val method', function () {
      var schema = {};
      var proxy = StateProxy.create(schema);

      it('should be defined', function () {
        expect(proxy.val).toBeDefined();
      });
      it('should equal undefined by default', function () {
        expect(proxy.val()).toBeUndefined();
      });
      it('should return the same value as it was set to it', function () {
        proxy.val('TestVal');
        expect(proxy.val()).toBe('TestVal');
      });

      describe('with default value in schema', function () {
        var schema = {
          default: 'defaultTest'
        };
        var proxy = StateProxy.create(schema);

        it('should return value from schema by default', function () {
          expect(proxy.val()).toBe('defaultTest');
        });
      });

      describe('with calculated val function set in schema', function () {
        var schema = {
          val: function (getState) {
            return 'calculated';
          }
        };
        var proxy = StateProxy.create(schema);

        it('should return calculated value', function () {
          expect(proxy.val()).toBe('calculated');
        });

        it('should ignore setting', function () {
          proxy.val('settingTest');
          expect(proxy.val()).toBe('calculated');
        });
      });
    });
  });

  describe('Full Schema', function () {
    var personSchemaDefinition = {
      type: StateProxy.SchemaTypes.object,
      properties: {
        FirstName: {
          type: StateProxy.SchemaTypes.string
        },
        LastName: {
          type: StateProxy.SchemaTypes.string
        },
        Age: {
          type: StateProxy.SchemaTypes.number,
          default: 21
        },
        HasPermanentJob: {
          type: StateProxy.SchemaTypes.bool
        },
        Parents: {
          type: StateProxy.SchemaTypes.list,
          listItem: {
            type: StateProxy.SchemaTypes.object,
            properties: {
              FirstName: {
                type: StateProxy.SchemaTypes.string
              },
              LastName: {
                type: StateProxy.SchemaTypes.string
              }
            }
          }
        },
        Income: {
          type: StateProxy.SchemaTypes.object,
          properties: {
            Frequency: {
              type: StateProxy.SchemaTypes.string
            },
            Amount: {
              type: StateProxy.SchemaTypes.number
            }
          }
        },
        Education: {
          type: StateProxy.SchemaTypes.dynamic
        },
        Notes: {}
      }
    };

    describe('Without getState and setState', function () {
      var person = StateProxy.create(personSchemaDefinition);

      it('should have proper signature', function () {
        expect(person.val).toBeDefined();
        expect(person.validate).toBeDefined();
        expect(person.getState).toBeDefined();
        expect(person.properties).toBeDefined();
        expect(person.properties.FirstName).toBeDefined();
        expect(person.properties.LastName).toBeDefined();
        expect(person.properties.Age).toBeDefined();
        expect(person.properties.HasPermanentJob).toBeDefined();
        expect(person.properties.Parents).toBeDefined();
        expect(person.properties.Income).toBeDefined();
        expect(person.properties.Income.properties).toBeDefined();
        expect(person.properties.Income.properties.Frequency).toBeDefined();
        expect(person.properties.Income.properties.Amount).toBeDefined();
        expect(person.properties.Education).toBeDefined();
        expect(person.properties.Notes).toBeDefined();
      });
    });
  });
});