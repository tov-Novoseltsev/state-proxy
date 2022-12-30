export interface IValidationResult {
  isValid: boolean;
  validationMessage?: string;
}

export interface IGetState {
  (): { val: any; };
  getParentState: IGetState;
}

interface IStateProxySchema {
  type?: keyof ISchemaTypes;
  default?: any;
  ignored?: boolean;
  required?: boolean | (() => void);
  maxLength?: number;
  properties?: any;
  validate?: () => IValidationResult;
  listItem?: IStateProxySchema;
  getDataTransform?: (data) => any;
  setDataTransform?: <T>(data: T) => T;
}

export interface IStateProxyNode {
  getDefaultState: (overrides?) => IGetState;
  properties: any;
  getState: (overrides?) => { val: any; hasChanges?: boolean; touched?: boolean; };
  setTouched: () => void;
  val: (newVal?: any, isTouched?: boolean) => any;
  ignored: () => boolean;
  required: () => boolean;
  validate: (ignoreChanges?: Boolean) => IValidationResult;
  exposeRequiredErrors: () => void;
  resetToDefault: () => void;
  schema: IStateProxySchema;
  setData: (data: any) => any;
  getData: () => any;
}

export interface IStateProxyObjectNode extends IStateProxyNode {
  validate: (ignoreChanges?: Boolean) => IValidationResult & { invalidProperties: { [key: string]: IValidationResult } };
}

export interface IStateProxyListNode extends IStateProxyNode {
  getItems: () => IStateProxyNode[];
}

interface ISchemaTypes {
  dynamic: undefined;
  bool: 'bool';
  number: 'number';
  string: 'string';
  object: 'object';
  list: 'list';
}

export interface IStateProxy {
  formValidationResult(validationResult: Boolean, validationMessage: string): IValidationResult;
  SchemaTypes: ISchemaTypes;
  create(schema: IStateProxySchema, getState?: () => any, setState?: (newState: any) => void): IStateProxyNode;
}