import { QueryTermExpression, TermOperatorLabelCollection, TermSubjectCollection } from '../QueryTermBuilder/types';

const labelifyExclusiveRangeValue = (rangeValue: { $gt: any; $lt: any } | null) => {
  if (rangeValue === null) {
    return '';
  }

  const { $gt, $lt } = { ...rangeValue };
  if (!$gt && !$lt) {
    return '';
  }
  if (!$gt) {
    return `less than ${$lt}`;
  }
  if (!$lt) {
    return `greater than ${$gt}`;
  }

  return `between ${$gt} and ${$lt}`;
};
const labelifyInclusiveRangeValue = (rangeValue: { $gte: any; $lte: any } | null) => {
  if (rangeValue === null) {
    return '';
  }

  const { $gte, $lte } = { ...rangeValue };
  if (!$gte && !$lte) {
    return '';
  }
  if (!$gte) {
    return `less than ${$lte}`;
  }
  if (!$lte) {
    return `greater than ${$gte}`;
  }

  return `between ${$gte} and ${$lte}`;
};

// maybe put this is a helper file.
export const defaultExpressionLabelMaker = (
  qExpression: QueryTermExpression | null,
  subjects: TermSubjectCollection,
  opLabels: TermOperatorLabelCollection
): string => {
  if (qExpression === null) {
    return 'NULL';
  }

  const decorateLabel = () => {
    switch (qExpression.operator) {
      case '$betweenI':
        return labelifyInclusiveRangeValue(
          qExpression.value as { $gte: any; $lte: any }
        );
      case '$betweenX':
        return labelifyExclusiveRangeValue(qExpression.value as { $gt: any; $lt: any });
      // return JSON.stringify(qExpression.value);
      default:
        return `'${qExpression.value}'`;
    }
  };

  // const subjects = queryConfigs['customers'].termSubjects;
  // const opLabels = queryConfigs['customers'].compareOperatorLabels;
  let label = [];
  label.push(subjects[qExpression.subjectId].label);
  if (qExpression.operator !== '$betweenI' && qExpression.operator !== '$betweenX') {
    label.push(opLabels[qExpression.operator].long);
  }

  label.push(decorateLabel());
  return label.join(' ');
};

