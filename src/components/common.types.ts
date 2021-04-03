// import { TermValue } from "./QueryInput/term.types";

export type Scalar = string | number;
export type ScalarList = Scalar[];

export type SelectOption = {
  value: string | number;
  label: string;
};

export type InputDataType = 'decimal' | 'integer' | 'date' | 'text';
export type TermOperators =
  | '$eq'
  | '$lt'
  | '$lte'
  | '$gt'
  | '$gte'
  | '$regex'
  | '$anyOf'
  // | '$in'
  | '$oneOf'
  | '$betweenX'
  | '$betweenI';

export const AllOperators: { [key in TermOperators]: string } = {
  $eq: '$eq',
  $lt: '$lt',
  $gt: '$gt',
  $lte: '$lte',
  $gte: '$gte',
  $regex: '$regex',
  $anyOf: '$anyOf',
  $oneOf: '$oneOf',
  $betweenX: '$betweenX',
  $betweenI: '$betweenI',
};

// export type TermValueTypes = string | number | object | null;
export type TermValueTypes = Scalar | ScalarList | object | null;

export type TermValue =
  // | { [key in TermOperators]: Scalar }
  // | { [key in TermOperators]: ScalarList }
  { [key in TermOperators]: ScalarList | Scalar | object } | null;

export type TermValueWithLabel = {
  termLabel: string;
  termValue: TermValue;
  // Scala string | number, Range object, SelectMultiple array
  // null probably unnecessary.  If null the expression is null
};

export type TermValueWithLabelOrNull = TermValueWithLabel | null;
