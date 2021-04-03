import {
  QueryTermExpression,
  QueryTermValue,
  TermOperatorLabelCollection,
  TermSubjectCollection,
  defaultOperatorLabels,
} from './types';

export const labelMaker = (expression: QueryTermExpression) => {
  return `${expression.subjectId} ${expression.operator} ${expression.value}`;
}

export const mangoExpressionMaker = (expression: QueryTermExpression) => {
  return {
    [expression.subjectId]: {
      [expression.operator]: expression.value,
    },
  };
};
