//cspell:ignore labelify

import { SelectOption, TermValueTypes } from '../components/common.types';
import {
  QueryTermExpression,
  TermOperatorLabelCollection,
  TermSubjectCollection,
} from '../components/QueryTermBuilder/types';
import { QELabelMaker } from '../components/QueryTermBuilderRedux/types';

const labelifyRangeValue = (rangeValue: { $min: any; $max: any } | null) => {
  if (rangeValue === null) {
    return '';
  }

  const { $min, $max } = { ...rangeValue };
  if (!$min && !$max) {
    return '';
  }
  if (!$max) {
    return `greater than ${$min}`;
  }
  if (!$min) {
    return `less than ${$max}`;
  }

  return `between ${$min} and ${$max}`;
};

const extractLabelFromOptions = (
  value: TermValueTypes,
  selectOptions: SelectOption[] = []
): string => {
  if (value === null) {
    return '';
  }
  for (let i = 0; i < selectOptions.length; i++) {
    if (selectOptions[i].value === value) {
      return selectOptions[i].label;
    }
  }

  return '';
};

const enUsDecorateValue = (
  qExpression: QueryTermExpression,
  subjects: TermSubjectCollection
) => {
  switch (qExpression.operator) {
    case '$betweenI':
      if (qExpression.value === null) {
        return labelifyRangeValue(null);
      }
      {
        // blocked scoped variables - no other purpose
        const { $gte: $min, $lte: $max } = qExpression.value as {
          $gte: any;
          $lte: any;
        };
        return labelifyRangeValue({ $min, $max });
      }
    case '$betweenX':
      if (qExpression.value === null) {
        return labelifyRangeValue(null);
      }
      let { $gt: $min, $lt: $max } = qExpression.value as { $gt: any; $lt: any };
      return labelifyRangeValue({ $min, $max });
    case '$oneOf':
      return ['date', 'text'].indexOf(qExpression.dataType) !== -1
        ? "'" +
            extractLabelFromOptions(
              // TODO - fix this its a deep routed issue to do with expected subject definitions
              qExpression.value,
              //@ts-ignore
              subjects[qExpression.subjectId].selectOptions.$oneOf
            ) +
            "'"
        : extractLabelFromOptions(
            // TODO - fix this its a deep routed issue to do with expected subject definitions
            qExpression.value,
            //@ts-ignore
            subjects[qExpression.subjectId].selectOptions.$oneOf
          );
    case '$anyOf':
      return qExpression.value === null
        ? ''
        : ['date', 'text'].indexOf(qExpression.dataType) !== -1
        ? `'${(qExpression.value as any[]).join("', '")}'`
        : (qExpression.value as any[]).join(", ");
    default:
      return qExpression.value === null
        ? ''
        : ['date', 'text'].indexOf(qExpression.dataType) !== -1
        ? `'${qExpression.value}'`
        : `${qExpression.value}`;
  }
};

const enUsOpLabel = (
  qExpression: QueryTermExpression | null,
  opLabels: TermOperatorLabelCollection
) => {
  if (!qExpression) {
    return '';
  }
  switch (qExpression.operator) {
    case '$anyOf':
      return opLabels['$anyOf'].long;
    case '$oneOf':
      return opLabels['$eq'].long || '=';
    case '$betweenX':
    case '$betweenI':
      return '';
    case undefined:
      return "Couldn't find label";
    default:
      return opLabels[qExpression.operator].long;
  }
};

const enUsQueryExpressionLabelMaker: QELabelMaker = (
  qExpression: QueryTermExpression | null,
  subjects: TermSubjectCollection,
  opLabels: TermOperatorLabelCollection
): string => {
  // qExpression *should* be completely valid
  // but with render and network sometimes these errors happen
  if (qExpression === null) {
    return 'Term Expression is null';
  }
  // if (!qExpression.subjectId) {
  //   console.log(`No Query Subject ID is set.`);
  // }
  // if (!subjects[qExpression.subjectId]) {
  //   console.log(`Can not find query subject id in query Subjects.`);
  // }

  const label = [];

  // subject/ fieldName
  subjects[qExpression.subjectId] && label.push(subjects[qExpression.subjectId].label);
  !subjects[qExpression.subjectId] && label.push(`Subject ID '${qExpression.subjectId}' Not Found `);

  // op label
  const opLabel = enUsOpLabel(qExpression, opLabels);

  if (opLabel && opLabel.length > 1) {
    label.push(enUsOpLabel(qExpression, opLabels));
  }

  // value
  label.push(enUsDecorateValue(qExpression, subjects));
  return label.join(' ');
};


const arMaQueryExpressionLabelMaker: QELabelMaker = (
  qExpression: QueryTermExpression | null,
  subjects: TermSubjectCollection,
  opLabels: TermOperatorLabelCollection
): string => {
  // Arabic/Morocco
  if (qExpression === null) {
    return 'queryTerm is NULL';
  }
  // if (!qExpression.subjectId) {
  //   console.log(`No Query Subject ID is set.`);
  // }
  // if (!subjects[qExpression.subjectId]) {
  //   console.log(`Can not find query subject id in query Subjects.`);
  // }

  const label = [];

  // subject/ fieldName
  label.push(subjects[qExpression.subjectId].label);

  // op label
  const opLabel = enUsOpLabel(qExpression, opLabels);
  if (opLabel && opLabel.length > 1) {
    label.push(enUsOpLabel(qExpression, opLabels));
  }
  // enUsOpLabel(qExpression, opLabels) !== ' ' &&
  //   label.push(enUsOpLabel(qExpression, opLabels));

  // value
  label.push(enUsDecorateValue(qExpression, subjects));
  return label.join(' ');
};

export const queryLabelMaker = (locale: string) => {
  switch (locale) {
    case 'en-us':
      return enUsQueryExpressionLabelMaker;
    case 'ar-ma':
      return arMaQueryExpressionLabelMaker;
    default:
    return enUsQueryExpressionLabelMaker;
 }
};

// primary module functions that have upstream guards
// making some code unreachable
export const untestables = {
  labelifyRangeValue,
  extractLabelFromOptions,
  enUsOpLabel,
};
