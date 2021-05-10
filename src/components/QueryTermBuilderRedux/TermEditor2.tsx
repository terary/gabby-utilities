import React, { useState } from 'react';
import { SimpleDropdown } from '../QueryTermBuilder/SimpleDropdown';
import { helpers } from '../../common/helpers';
import { TermOperators, TermValueTypes } from '../QueryTermBuilder/index';
import { InputMux } from '../QueryTermBuilder/index';
import { useDispatch } from 'react-redux';
import { updateNodeExpression, openForEdit } from './slice';
import { ButtonBar } from './ButtonBar';
import { useQEUtils } from './hooks';
import {
  QueryTermExpression,
  TermOperatorLabelCollection,
  TermSubjectCollection,
  defaultOperatorLabels,
} from '../QueryTermBuilder/types';
import { SelectOption } from '../QueryInput';
import { Grid } from '@material-ui/core';

const isScalarOperator = (op: string) => {
  return ['$eq', '$gt', '$lt', '$gte', '$lte', '$regex'].indexOf(op) !== -1;
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

interface TermEditor2Props {
  nodeId: string;
  operatorsWithLabels: TermOperatorLabelCollection;
  querySubjects: TermSubjectCollection;
}

export const TermEditor2 = ({
  nodeId = '',
  operatorsWithLabels = defaultOperatorLabels as TermOperatorLabelCollection,
  querySubjects = {},
}: TermEditor2Props) => {
  const { expressionCopy } = useQEUtils(nodeId);

  const dispatch = useDispatch();
  const [queryExpression, setQueryExpression] = useState(expressionCopy);
  // useEffect( () => console.log(`mount '${nodeId}'`), [] );
  // useEffect( () => console.log(`will update data1 '${nodeId}'`), [ nodeId ] );
  // useEffect( () => console.log(`will update any '${nodeId}'`) );
  // useEffect( () => () => console.log(`will update data1 or unmount '${nodeId}'`), [ nodeId ] );
  // useEffect( () => () => console.log(`unmount '${nodeId}'`), [] );

  const finishEdit = () => {
    dispatch(updateNodeExpression({ nodeId, expression: queryExpression }));
    dispatch(openForEdit({ nodeId, isOpenForEdit: false }));
  };

  const updateExpression = (newTerm: any) => {
    setQueryExpression(newTerm);
  };

  // if setSelectableValues is not being used.  Maybe this 
  // is not state?
  const [selectableValues, setSelectableValues] = useState(
    !queryExpression
      ? []
      : ((querySubjects[queryExpression.subjectId]?.selectOptions ||
          []) as SelectOption[])
  );

  const opLabels = extractLabels(operatorsWithLabels, 'long');
  const opsBySubjectId = makeOpsBySubjectId(opLabels, querySubjects);

  const handleSubjectChange = (newSubjectId: string) => {
    const newQueryExp = Object.assign({}, queryExpression);
    newQueryExp.subjectId = newSubjectId;
    newQueryExp.dataType = querySubjects[newSubjectId].dataType;
    newQueryExp.operator = querySubjects[newSubjectId].queryOps[0];
    newQueryExp.value = null;
    updateExpression(newQueryExp);
  };

  const handleOperatorChange = (newOperatorId: string) => {
    const newQueryExp = Object.assign({}, queryExpression);
    newQueryExp.operator = newOperatorId as TermOperators;

    if (
      !isScalarOperator(newQueryExp.operator) ||
      (queryExpression !== null && !isScalarOperator(queryExpression.operator))
    ) {
      newQueryExp.value = null;
    }
    updateExpression(newQueryExp);
  };

  // I think useCallback is unnecessary
  const handleValueChange = (newValue: TermValueTypes) => {
    const newQueryExp = Object.assign({}, queryExpression) as QueryTermExpression;
    newQueryExp.value = newValue;
    updateExpression(newQueryExp);
  };

  // const onFinish = () => {
  //   updateExpression(queryExpression);
  // };

  return (
    <Grid container direction="row">
      <Grid item>
        <SimpleDropdown
          options={querySubjects}
          selectedOption={queryExpression?.subjectId || 'NO SUBJECT ID SET'}
          label="Field Name"
          onChange={handleSubjectChange}
        />
      </Grid>
      <Grid item>
        {queryExpression && (
          <SimpleDropdown
            // options={opLabels}
            options={opsBySubjectId[queryExpression.subjectId] || {}}
            selectedOption={queryExpression.operator}
            label="Operator"
            onChange={handleOperatorChange}
          />
        )}
      </Grid>
      <Grid item>
        {queryExpression && (
          <>
            <InputMux
              // nodeId={nodeId}
              onChange={handleValueChange}
              queryExpression={queryExpression}
              initialValue={queryExpression.value}
              label=""
              selectOptions={selectableValues}
            />
          </>
        )}
        <ButtonBar nodeId={nodeId} subjects={querySubjects} onFinish={finishEdit} />
      </Grid>
    </Grid>
  );
};
