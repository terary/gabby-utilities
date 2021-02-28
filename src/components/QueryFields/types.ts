import { ReactChild } from 'react';

export enum QFieldDataTypeEnum {
  DATE = 'DATE',
  STRING = 'S.TRING',
  NUMBER = 'NUMBER',
}

export type QueryField = {
  label: string;
  datatype: QFieldDataTypeEnum;
  UIInput?: ReactChild;
};
export type QFieldCollection = { [fieldId: string]: QueryField };

export type SelectOption = {
  value: string;
  label: string;
};

export const QueryTermOperators = {
  eq: { longLabel: 'Equals', shortLabel: '=' },
  gt: { longLabel: 'Greater Than', shortLabel: '>' },
  lt: { longLabel: 'Less Than', shortLabel: '<' },
  regex: { longLabel: 'Contains', shortLabel: 'has' },
  betweenx: { longLabel: 'Between', shortLabel: 'from' },
  betweeni: { longLabel: 'Between and Including', shortLabel: 'from' },
} as QueryTermOperator;

export type QueryTermOperator = {
  [operator: string]: {
    longLabel: string;
    shortLabel: string;
  };
};
