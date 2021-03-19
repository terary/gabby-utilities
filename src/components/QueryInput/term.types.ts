/*
  QInput will call parent with value
  value will be {operator:termValue}
  termValue will be either a listScalar or objectScalar

  cb(
    {$gt: value1, $lt: value}
  )

  cb(
    {$eg: value}
  )

  cb(
    {$in: [value1, value2]}
  )
*/
import { SelectOption } from '../common.types';
import { Subfield, InputDataType } from '../GenericInput';

export type TermOperators = '$eq' | '$lt' | '$lte' | '$gt' | '$gte' | '$in' | '$regex';
export type Scalar = string | number;
export type ScalarList = Scalar[];

export type TermValue =
  | { [key in TermOperators]: Scalar }
  | { [key in TermOperators]: ScalarList }
  | null;

// type numberOrString = number | string;
// type ObjectOrNull = object | null;

type TermValueChangeMessage = {
  termLabel: string;
  termValue: TermValue;
};
export type TermValueChangeMessageOrNull = TermValueChangeMessage | null;

export type QueryTermValue = {
  label: string;
  value: string | number | object | null;
  // null probably unnecessary.  If null the expression is null
  // see QueryTermValueOrNull
};

export type QueryTermValueOrNull = QueryTermValue | null;
export type { SelectOption };
// export type SelectOption = {
//   value: string;
//   label: string;
// };
// ----------------------------------------
export interface IQInputChange {
  // for the time being not used, only here to keep notes.
  inputDataType?: InputDataType;
  // formatCallbackValues?:
  //   | ((value: numberOrString) => objectOrNull) // scalar
  //   | ((value: numberOrString[]) => objectOrNull) // multiple select
  //   | ((min: any, max: any) => object); // range

  formatDisplayValues?:
    | ((value: Scalar) => string) // scalar
    | ((value: Scalar[]) => string) // multiple select
    | ((min: any, max: any) => string); // range

  inputProps?: object;
  label?: string;
  onChange?: (termValues: TermValueChangeMessageOrNull) => void;
}
