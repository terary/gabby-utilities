export type SelectOption = {
  value: string;
  label: string;
};

export type SwitchOption = {
  label: string;
  controlId: string; // for DOM purposes used in <input name,id
  // fieldId: string; // for identifying which switch
  intialValue?: boolean;
};

export type SwitchOptionCollection = {
  [fieldId: string]: SwitchOption;
};
