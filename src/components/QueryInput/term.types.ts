import { SelectOption, TermOperators } from '../common.types';
import { InputDataType } from '../GenericInput';
import { TermValueWithLabelOrNull, Scalar, TermValue } from './index';

export type { SelectOption, TermOperators };

export interface IQInputComponent {
  inputDataType?: InputDataType;
  formatCallbackValues?:
    | ((value: Scalar) => TermValue) // scalar
    | ((value: Scalar[]) => TermValue) // multiple select
    | ((min: any, max: any) => TermValue); // range

  formatDisplayValues?:
    | ((value: Scalar) => string) // scalar
    | ((value: Scalar[]) => string) // multiple select
    | ((min: any, max: any) => string); // range

  inputProps?: object;
  label?: string;
  onChange?: (termValues: TermValueWithLabelOrNull) => void;
}
