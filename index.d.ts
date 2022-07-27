declare module 'state-proxy' {
  interface IValidationResult {
    isValid: Boolean;
    validationMessage?: string;
  }

  interface IGetState {
    (): { val: any; };
    getParentState: IGetState;
  }

  interface IStateProxyNode {
    getDefaultState: (overrides?) => IGetState;
    properties: any;
    getState: (overrides?) => { val: any; hasChanges: boolean; };
    val: (newVal?: any) => any;
    ignored: () => boolean;
    required: () => boolean;
    validate: (ignoreChanges?: Boolean) => IValidationResult;
    exposeRequiredErrors: () => void;
    resetToDefault: () => void;
    schema: { type: string, required: () => void; maxLength?: number; };
    setData: (data: any) => any;
    getData: () => any;
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
    create(schema: Object, getState?: () => any, setState?: (newState: any) => void): IStateProxyNode;
  }
}