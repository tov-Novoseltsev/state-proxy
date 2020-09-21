declare module 'state-proxy' {
  interface IValidationResult {
    isValid: Boolean;
    validationMessage?: string;
  }

  interface IGetState {
    (): { val: any; };
    getParentState: () => { val: any; };
  }

  interface IStateProxyInstance {
    val: (val?: any) => any;
    properties: any;
    getData: () => any;
    setData: (data: any) => void;
    getDefaultState: () => Object;
    validate: (ignoreChanges?: Boolean) => IValidationResult;
    exposeRequiredErrors: () => void;
  }

  interface IStateProxyNode {
    getDefaultState: (overrides?) => { val: any; };
    getState: (overrides?) => { val: any; };
    val: (newVal: any) => any;
    ignored: () => boolean;
    required: () => boolean;
    validate: (ignoreChanges?: Boolean) => IValidationResult;
    exposeRequiredErrors: () => void;
    resetToDefault: () => void;
    schema: () => { type: string, required: () => void; };
  }

  interface ISchemaTypes {
    dynamic: undefined;
    bool: 'bool';
    number: 'number';
    string: 'string';
    object: 'object';
    list: 'list';
  }

  interface IStateProxy {
    formValidationResult(validationResult: Boolean, validationMessage: string): IValidationResult;
    SchemaTypes: ISchemaTypes;
    create(schema: Object, getState?: () => any, setState?: (newState: any) => void): IStateProxyInstance;
  }
}