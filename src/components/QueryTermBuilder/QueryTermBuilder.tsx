import React, { useEffect, useState } from 'react';
import { SimpleDropdown } from './SimpleDropdown';
import { helpers } from '../../common/helpers';
import { InputMux } from './InputMux';
import { TermOperators, TermValueTypes } from './index';
import {
  QueryTermExpression,
  TermOperatorLabelCollection,
  TermSubjectCollection,
  defaultOperatorLabels,
} from './types';
import { SelectOption } from '../QueryInput';
import { Grid } from '@material-ui/core';

const isScalarOperator = (op: string) => {
  return ['$eq', '$gt', '$lt', '$gte', '$lte', '$regex'].indexOf(op) !== -1;
};

const onExpressionChangeNoop = (express: QueryTermExpression | null) => {};

const firstKey = (obj: object) => {
  return Object.keys(obj)[0] || '';
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

  // TODO - initialQueryExpression should accept null if onchange allows nulls (maybe)
  initialQueryExpression?: QueryTermExpression;
}

export const QueryTermBuilder = ({
  nodeId = '',
  operatorsWithLabels = defaultOperatorLabels as TermOperatorLabelCollection,
  onExpressionChange = onExpressionChangeNoop,
  querySubjects = {},
  initialQueryExpression = makeInitialQueryExpression(
    nodeId,
    querySubjects,
    operatorsWithLabels
  ),
}: QueryTermBuilderProps) => {
  const [queryExpression, setQueryExpression] = useState(initialQueryExpression);
  const [selectableValues, setSelectableValues] = useState(
    (querySubjects[queryExpression.subjectId]?.selectOptions || []) as SelectOption[]
    // (queryExpression.operator==="$anyOf" || queryExpression.operator==="$oneOf") 
    //   //@ts-ignore
    //   ? querySubjects[queryExpression.subjectId].selectOptions[queryExpression.operator] || []
    //   : [] as SelectOption[]
    // (querySubjects[queryExpression.subjectId]?.selectOptions || []) as SelectOption[]
    //@ts-ignore
    // (querySubjects[queryExpression.subjectId]?.selectOptions?.[queryExpression.operator] ||
    //   []) as SelectOption[]
  );

  const opLabels = extractLabels(operatorsWithLabels, 'long');
  // gets called multiple times- not desirable.
  // useRef maybe a friend but docs says 'for mutable' and this should not be
  // mutable.
  const opsBySubjectId = makeOpsBySubjectId(opLabels, querySubjects);

  useEffect(() => {
    setSelectableValues(getSelectableOptions(queryExpression, querySubjects));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryExpression]);

  const handleSubjectChange = (newSubjectId: string) => {
    const newQueryExp = Object.assign({}, queryExpression);
    newQueryExp.subjectId = newSubjectId;
    newQueryExp.dataType = querySubjects[newSubjectId].dataType;
    newQueryExp.operator = querySubjects[newSubjectId].queryOps[0];
    newQueryExp.value = null;

    setQueryExpression(newQueryExp);
    _doUpdate(newQueryExp);
  };

  const handleOperatorChange = (newOperatorId: string) => {
    const newQueryExp = Object.assign({}, queryExpression);
    newQueryExp.operator = newOperatorId as TermOperators;

    if (
      !isScalarOperator(newQueryExp.operator) ||
      !isScalarOperator(queryExpression.operator)
    ) {
      newQueryExp.value = null;
    }
    setQueryExpression(newQueryExp);
    _doUpdate(newQueryExp);
  };

  const handleValueChange = (newValue: TermValueTypes) => {
    // if (newValue === null) {
    //   onExpressionChange(null);
    //   return;
    // }

    const newQueryExp = Object.assign({}, queryExpression) as QueryTermExpression;
    newQueryExp.value = newValue;
    setQueryExpression(newQueryExp);
    _doUpdate(newQueryExp);
  };

  const _doUpdate = (newQueryExp: QueryTermExpression) => {
    // if (hasNull(newQueryExp)) {
    //   onExpressionChange(null);
    // } else {
    //   onExpressionChange(newQueryExp);
    // }
    onExpressionChange(newQueryExp);
  };

  return (
    <Grid container direction="row">
      <Grid item>
        <SimpleDropdown
          options={querySubjects}
          selectedOption={queryExpression.subjectId}
          label="Field Name"
          onChange={handleSubjectChange}
        />
      </Grid>
      <Grid item>
        <SimpleDropdown
          // options={opLabels}
          options={opsBySubjectId[queryExpression.subjectId] || {}}
          selectedOption={queryExpression.operator}
          label="Operator"
          onChange={handleOperatorChange}
        />
      </Grid>
      <Grid item>
        <InputMux
          onChange={handleValueChange}
          queryExpression={queryExpression}
          label=""
          selectOptions={selectableValues}
        />
      </Grid>
    </Grid>
  );
};
