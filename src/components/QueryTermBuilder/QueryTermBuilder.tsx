import React, { useEffect, useState } from 'react';
import { SimpleDropdown } from './SimpleDropdown';
import { helpers } from '../../common/helpers';

import { InputMux } from './InputMux';
import { TermOperators, TermValueWithLabelOrNull } from './index';
import {
  QueryTermExpression,
  QueryTermValue,
  TermOperatorLabelCollection,
  TermSubjectCollection,
  defaultOperatorLabels,
} from './types';
import { ScalarList, SelectOption } from '../QueryInput';

const onExpressionChangeNoop = (express: QueryTermExpression | null) => {};

const firstKey = (obj: object) => {
  return Object.keys(obj)[0] || '';
};
const hasNull = (thingy: object | null) => {
  if (thingy === null) {
    return true;
  }
  let hasNull = false;
  Object.entries(thingy).forEach(([key, property]) => {
    if (property === null) {
      hasNull = true;
    }
  });
  return hasNull;
};

const getSelectableOptions = (
  qExpression: QueryTermExpression,
  termSubjects: TermSubjectCollection
) => {
  if (!qExpression.subjectId) {
    return [] as SelectOption[];
  }
  if (!qExpression.operator) {
    return [] as SelectOption[];
  }
  if (!termSubjects) {
    return [] as SelectOption[];
  }
  if (!termSubjects[qExpression.subjectId]) {
    return [] as SelectOption[];
  }
  if (!termSubjects[qExpression.subjectId].selectOptions) {
    return [] as SelectOption[];
  }

  return termSubjects[qExpression.subjectId].selectOptions || ([] as SelectOption[]);
};

const makeInitialQueryExpression = (
  nodeId: string,
  querySubject: TermSubjectCollection,
  operatorsWithLabels: TermOperatorLabelCollection
): QueryTermExpression => {
  return {
    dataType: querySubject[firstKey(querySubject)].dataType,
    nodeId,
    subjectId: firstKey(querySubject),
    operator: firstKey(operatorsWithLabels),
    value: null, // not sure if null is a better option
    mongoExpression: null,
  } as QueryTermExpression;
};

const makeOpsBySubjectId = (
  opLabels: { [op: string]: { id: string; label: string } },
  querySubjects: TermSubjectCollection
) => {
  const opsBySubject: { [op: string]: any } = {};
  Object.entries(querySubjects).forEach(([subjectId, subject]) => {
    opsBySubject[subjectId] = helpers.objectFilter(opLabels, ...subject.queryOps);
  });
  return opsBySubject;
};

const extractLabels = (obj: { [id: string]: any }, labelKey: string) => {
  return Object.entries(obj).reduce((acc: any, cur) => {
    const [key, value] = cur;
    acc[key] = { id: key, label: value[labelKey] };
    return acc;
  }, {});
};

interface QueryTermBuilderProps {
  nodeId: string;
  operatorsWithLabels: TermOperatorLabelCollection;
  onExpressionChange: (expression: QueryTermExpression | null) => void;
  querySubjects: TermSubjectCollection;
}

export const QueryTermBuilder = ({
  nodeId = '',
  operatorsWithLabels = defaultOperatorLabels as TermOperatorLabelCollection,
  onExpressionChange = onExpressionChangeNoop,
  querySubjects = {},
}: QueryTermBuilderProps) => {
  const [queryExpression, setQueryExpression] = useState(
    makeInitialQueryExpression(nodeId, querySubjects, operatorsWithLabels)
  );
  const [selectableValues, setSelectableValues] = useState([] as SelectOption[]);
  const opLabels = extractLabels(operatorsWithLabels, 'long');
  // gets called multiple times- not desirable.
  // useRef maybe a friend but docs says 'for mutable' and this should not be
  // mutable.
  const opsBySubjectId = makeOpsBySubjectId(opLabels, querySubjects);

  const handleSubjectChange = (newSubjectId: string) => {
    const newQueryExp = Object.assign({}, queryExpression);
    newQueryExp.subjectId = newSubjectId;
    newQueryExp.dataType = querySubjects[newSubjectId].dataType;
    newQueryExp.operator = querySubjects[newSubjectId].queryOps[0];
    newQueryExp.value = null;
    _doUpdate(newQueryExp);
  };

  useEffect(() => {
    setSelectableValues(getSelectableOptions(queryExpression, querySubjects));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryExpression]);

  const handleOperatorChange = (newOperatorId: string) => {
    // will have to change mongoExpression.operator - or ?
    const newQueryExp = Object.assign({}, queryExpression);
    newQueryExp.operator = newOperatorId as TermOperators;
    _doUpdate(newQueryExp);
  };

  const handleValueChange = (newValue: QueryTermValue | null) => {
    if (newValue === null) {
      // probably would do some house cleaning.. Redux.delete or similar
      onExpressionChange(null);
      return;
    }

    const newQueryExp = Object.assign({}, queryExpression, newValue) as any;
    newQueryExp.mongoExpression = { [queryExpression.subjectId]: newValue.mongoValue };
    newQueryExp.label = buildLabel(newQueryExp as QueryTermExpression, newValue.label);
    // some overlap in type - but mongoValue is not part of QueryExpression
    delete newQueryExp.mongoValue;
    console.dir(newValue);

    _doUpdate(newQueryExp as QueryTermExpression);
  };

  const buildLabel = (q: QueryTermExpression, valueLabel: string) => {
    //  operatorsWithLabels,

    return [
      querySubjects[q.subjectId].label,
      operatorsWithLabels[q.operator].long,
      valueLabel,
    ].join(' ');
  };

  const _doUpdate = (newQueryExp: QueryTermExpression) => {
    setQueryExpression(newQueryExp);
    if (hasNull(newQueryExp)) {
      onExpressionChange(null);
    } else {
      onExpressionChange(newQueryExp);
    }
  };

  return (
    <>
      <hr />
      {}
      <SimpleDropdown
        options={querySubjects}
        selectedOption={queryExpression.subjectId}
        label="Field Name"
        onChange={handleSubjectChange}
      />
      <hr />
      <SimpleDropdown
        // options={opLabels}
        options={opsBySubjectId[queryExpression.subjectId] || {}}
        selectedOption={queryExpression.operator}
        label="Operator"
        onChange={handleOperatorChange}
      />
      <hr />
      <InputMux
        onChange={handleValueChange}
        queryExpression={queryExpression}
        label="First Name is"
        selectOptions={selectableValues}
        // querySubjects={querySubjects}
      />
    </>
  );
};
