import {
  QueryTermExpression,
  TermOperatorLabelCollection,
  TermSubjectCollection,
} from '../QueryTermBuilder/types';

export type QELabelMaker = (
  queryExpression: QueryTermExpression | null,
  subjects: TermSubjectCollection,
  opLabels: TermOperatorLabelCollection
) => string;
