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
export type TermOperators = '$eq' | '$lt' | '$lte' | '$gt' | '$gte' | '$in' | '$regex';
export type Scalar = string | number;
export type ScalarList = Scalar[];

export type TermValue =
  | { [key in TermOperators]: Scalar }
  | { [key in TermOperators]: ScalarList };

type TermValueChangeMessage = {
  termLabel: string;
  termValue: TermValue;
};
export type TermValueChangeMessageOrNull = TermValueChangeMessage | null;
export interface IQInputChange {
  // for the time being not used, only here to keep notes.
  onChange?: (termValues: TermValueChangeMessageOrNull) => void;
  // TODO - This should allow optional -
}
