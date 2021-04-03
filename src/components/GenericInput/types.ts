import { SelectOption } from '../common.types';
import { InputDataType } from '../common.types';
export type { SelectOption, InputDataType };
export type SwitchOption = {
  label: string;
  controlId: string; // for DOM purposes used in <input name,id
  initialValue?: boolean;
};

export type SwitchOptionCollection = {
  [fieldId: string]: SwitchOption;
};
