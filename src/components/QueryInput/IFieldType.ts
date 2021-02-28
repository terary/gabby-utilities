export enum CONDITION_OPERATORS {
  eq = '$eq',
  ge = '$ge',
  gt = '$gt',
  le = '$le',
  lt = '$lt',
}

export interface IFieldCompoentPros {
  conditionOperator: CONDITION_OPERATORS;
  fieldId: string;
  helperText?: string;
  id: string;
  // initialValue?: string; // maybe have generic and union with Text or other Type?
  initialValue?: string | object;
  label?: string;
  nodeId: string;

  onChange?: (qCondition: QSingleConditionChangeMessage) => void;
  validator?: (...args: any[]) => UIValidatorError;
}

// parentChangeNotifier - needs  some help will signature changes
// with different control type
//
// Need to define control respponsibiltiy.  - only to send {nodeId:NodeValue}
// nothing more.  The qOperator or field name are something else.

export interface IGenericFieldCompoentPros {
  conditionOperator: CONDITION_OPERATORS;
  fieldId: string;
  helperText?: string;
  id: string;
  label?: string;
  nodeId: string;

  onChangeParent?: (qCondition: QSingleConditionChangeMessage) => void;
  validator?: (...args: any[]) => UIValidatorError;
}

export type QSingleCondition = {
  [fieldId: string]: {
    [op in CONDITION_OPERATORS]: object | string | number | null; // dates will be represented as strings
  };
};

export type QSingleConditionChangeMessage = {
  nodeId: string;
  condition: QSingleCondition;
};

export type UIValidator = (...args: any[]) => UIValidatorError;
export type UIValidatorError = {
  hasError: boolean;
  errorText: string;
};

// export interface IFieldType {};
