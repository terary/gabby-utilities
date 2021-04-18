import {
  TermSubject,
  TermSubjectCollection,
  TermOperatorLabelCollection,
  QueryTermExpression,
} from '../components/QueryTermBuilder/types';

import QueryConfigCustomers from './customers';

export type QueryConfig = {
  termSubjects: TermSubjectCollection;
  compareOperatorLabels: TermOperatorLabelCollection;
}

type QueryConfigCollection = {
  [configId: string]: QueryConfig;
};

const queryConfigs = {
  customers: QueryConfigCustomers,
} as QueryConfigCollection;

let isFirstRun = true;

const fetchConfig = (configId: string) => {
  // doesn't make sense to make createEntity.. for this structure and write once read many.
  // {ids: string[], Entities:{}} -- maybe its ok
  // more basic without createEntity seems a little better but then it becomes mix-match
  //
  // currently stubbing with similar behavior key/value, short delay.
  // maybe it makes sense to make stateful if consider debounce

  return new Promise<QueryConfig>((resolve, reject) => {
    const timeOut = isFirstRun ? 1500 : 0;
    isFirstRun = false;
    // call it a million times - should be ok  but only ever need to call network
    //  1 time.
    setTimeout(() => {
      if (queryConfigs[configId]) {
        return resolve(queryConfigs[configId]);
      }
      reject(`No Query Configuration Found for '${configId}'`);
    }, timeOut);
  });
}
export default fetchConfig;


export const queryExpressionLabelMaker = (
  qExpression: QueryTermExpression | null
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

  const subjects = queryConfigs['customers'].termSubjects;
  const opLabels = queryConfigs['customers'].compareOperatorLabels;
  let label = [];
  label.push(subjects[qExpression.subjectId].label);
  if (qExpression.operator !== '$betweenI' && qExpression.operator !== '$betweenX') {
    label.push(opLabels[qExpression.operator].long);
  }

  label.push(decorateLabel());
  return label.join(' ');
};

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
