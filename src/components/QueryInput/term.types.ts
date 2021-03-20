import { SelectOption } from '../common.types';
import { InputDataType } from '../GenericInput';

export type TermOperators = '$eq' | '$lt' | '$lte' | '$gt' | '$gte' | '$in' | '$regex';
export type Scalar = string | number;
export type ScalarList = Scalar[];

export type TermValue =
  | { [key in TermOperators]: Scalar }
  | { [key in TermOperators]: ScalarList }
  | null;

export type TermValueWithLabel = {
  termLabel: string;
  termValue: string | number | object | null;
  // Scala string | number, Range object, SelectMultiple array
  // null probably unnecessary.  If null the expression is null
};

export type TermValueWithLabelOrNull = TermValueWithLabel | null;

export type { SelectOption };
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
