import { SelectOption } from '../QueryInput';
import { InputDataType, TermOperators, TermValueTypes } from './index';

export type TermSubject = {
  id: string;
  label: string;
  dataType: InputDataType;
  queryOps: TermOperators[];
  selectOptions?: SelectOption[];
};

export type TermSubjectCollection = {
  // this id will be the same id in the TermSubject
  [id: string]: TermSubject;
};

export type QueryTermExpression = {
  dataType: InputDataType;
  // label: string;
  // mongoExpression: object | null;
  nodeId: string; // form 0:3:2:1 or similar
  operator: TermOperators; // string;
  subjectId: string;
  value: TermValueTypes;
};
export type QueryTermValue = {
  // dataType: InputDataType;
  label: string;
  mongoValue: object | null;
  // mongoExpression: object | null;
  // nodeId: string; // form 0:3:2:1 or similar
  // operator: TermOperators; // string;
  // subjectId: string;
  value: string | number | object | null; // Scalar | object | null
};

// TODO - QueryTermValue should no long be used.
// TODO - Audit where/how types are being used - I think there is some overlap causing confusion
//      - There are unused types
// TODO - TermValues: .... object;  I think Object should be {[$gte|$gt|$lt|$lte]}

export type TermOperatorLabelCollection = {
  [key in TermOperators]: {
    short: string;
    long: string;
  };
};

export const defaultOperatorLabels = {
  $eq: {
    long: 'Is',
    short: '=',
  },
  $lt: {
    long: 'Less Than',
    short: '<',
  },
  $gt: {
    long: 'Greater Than',
    short: '>',
  },
  $lte: {
    long: 'Less or Equal',
    short: '=<',
  },
  $gte: {
    long: 'Greater or Equal',
    short: '>=',
  },
  $regex: {
    long: 'Contains',
    short: 'has',
  },
  $anyOf: {
    long: 'Any Of',
    short: 'in',
  },
  $oneOf: {
    long: 'One Of',
    short: 'is',
  },
  $betweenX: {
    long: 'Between',
    short: 'between',
  },
  $betweenI: {
    long: 'BetweenI',
    short: 'between',
  },
} as TermOperatorLabelCollection;
