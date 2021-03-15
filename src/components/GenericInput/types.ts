export type SelectOption = {
  value: string | number;
  label: string;
};

export type SwitchOption = {
  label: string;
  controlId: string; // for DOM purposes used in <input name,id
  // fieldId: string; // for identifying which switch
  initialValue?: boolean;
};

export type SwitchOptionCollection = {
  [fieldId: string]: SwitchOption;
};

export type InputDataType = 'decimal' | 'integer' | 'date' | 'text';
