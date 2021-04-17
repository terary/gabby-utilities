import {
  TermSubject,
  TermSubjectCollection,
  TermOperatorLabelCollection,
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
    const timeOut = isFirstRun ? 500 : 0;
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
