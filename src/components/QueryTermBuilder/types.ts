export enum FIELD_DATA_TYPE {
  DATE = 'DATE',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export type DBField = {
  label: string;
  datatype: FIELD_DATA_TYPE;
};
export type DBFieldCollection = { [fieldId: string]: DBField };

// export type SelectOption = {
//   value: string;
//   label: string;
// };
export type QueryTermOperator = {
  shortLabel: string;
  longLabel: string;
};
export type QueryTermOperatorCollection = {
  [operator: string]: QueryTermOperator;
};

export const QueryTermOperators = {
  eq: { longLabel: 'Equals', shortLabel: '=' },
  gt: { longLabel: 'Greater Than', shortLabel: '>' },
  // lt: { longLabel: 'Less Than', shortLabel: '<' },
  // regex: { longLabel: 'Contains', shortLabel: 'has' },
  // betweenx: { longLabel: 'Between', shortLabel: 'from' },
  // betweeni: { longLabel: 'Between and Including', shortLabel: 'from' },
} as QueryTermOperatorCollection;

// export type QueryTermOperator = {
//   [operator: string]: {
//     longLabel: string;
//     shortLabel: string;
//   };
// };
