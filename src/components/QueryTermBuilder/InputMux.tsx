import React, { useEffect, useState } from 'react';
import {
  QInputRange,
  QInputScalar,
  QInputSelectMultiple,
  QInputSelectSingle,
  SelectOption,
} from '../QueryInput';
import { QueryTermExpression, QueryTermValue } from './types';
import {
  TermValueWithLabel,
  TermValue,
  TermValueTypes,
  Scalar,
  ScalarList,
} from './index';
import { CommuteOutlined } from '@material-ui/icons';

interface InputMuxProps {
  queryExpression: QueryTermExpression;
  label: string;
  onChange: (newValue: TermValueTypes) => void;
  selectOptions?: SelectOption[];
  initialValue?: TermValueTypes;
}

//TODO - each of qInput needs to have initialValue={queryExpression.value}
//       that will cause issue when types are not similar betweenx->gte for example
//                                                        $eq -> $in
//       Scalar -> Scalar ok.  Object->Object ok. SomeType to OtherTye not ok.
export const InputMux = ({
  label,
  queryExpression,
  onChange,
  selectOptions,
}: InputMuxProps) => {
  const [thisValue, setThisValue] = useState(queryExpression.value);

  // useEffect(() => {
  //   if (queryExpression.operator === '$betweenX') {
  //     setThisInitialValue([]);
  //   } else {
  //     //setThisInitialValue(queryExpression.value);
  //     setThisInitialValue(null);
  //   }
  // }, [queryExpression.value]);

  const handleValueChange = (newValue: TermValueWithLabel | null) => {
    if (newValue === null || newValue.termValue === null) {
      onChange(null);
      // setThisValue(null);
      return;
    }
    const termValue = newValue?.termValue[queryExpression.operator];

    let qValue: TermValueTypes = termValue;

    if (queryExpression.operator === '$oneOf') {
      qValue = newValue?.termValue['$eq'];
    }
    if (queryExpression.operator === '$betweenX') {
      qValue = newValue?.termValue || null;
    }
    if (queryExpression.operator === '$betweenI') {
      qValue = newValue?.termValue || null;
    }
    onChange(qValue);
    // setThisValue(qValue);
  };
  // const getType = () => {
  //   return queryExpression.dataType;
  // };
  // const getInitialValue = () => {
  //   return queryExpression.value;
  // };

  return (
    <>
      {['$betweenX', '$betweenI'].indexOf(queryExpression.operator) !== -1 && (
        <QInputRange
          onChange={handleValueChange}
          initialValue={
            queryExpression.value ? (queryExpression.value as Object) : undefined
          }
          // initialValue={initialValue ? (initialValue as Object) : undefined}
          label={label}
          rangeOption={
            queryExpression.operator === '$betweenX' ? 'exclusive' : 'inclusive'
          }
          formatDisplayValues={(min, max) => {
            if (min && max) {
              return `${min} and ${max}`;
            }
            return min || max;
          }}
          inputDataType={queryExpression.dataType}
        />
      )}
      {queryExpression.operator === '$oneOf' && (
        <QInputSelectSingle
          onChange={handleValueChange}
          label={label}
          // initialValue={initialValue ? (initialValue as Scalar) : undefined}
          initialValue={
            queryExpression.value ? (queryExpression.value as Scalar) : undefined
          }
          inputDataType={queryExpression.dataType}
          options={selectOptions || ([] as SelectOption[])}
        />
      )}
      {queryExpression.operator === '$anyOf' && (
        <QInputSelectMultiple
          onChange={handleValueChange}
          label={label}
          inputDataType={queryExpression.dataType}
          options={selectOptions || ([] as SelectOption[])}
          termOperator={queryExpression.operator}
          // initialValue={initialValue ? (initialValue as ScalarList) : undefined}
          initialValue={
            queryExpression.value ? (queryExpression.value as ScalarList) : undefined
          }
        />
      )}
      {['$betweenX', '$betweenI', '$anyOf', '$oneOf'].indexOf(
        queryExpression.operator
      ) === -1 && (
        <QInputScalar
          onChange={handleValueChange}
          label={label}
          termOperator={queryExpression.operator}
          initialValue={(queryExpression.value || '') as Scalar}
          // initialValue={(thisValue || '') as Scalar}
          // inputProps={{ 'force-rerender': Math.random() + '' }}
          // initialValue={thisInitialValue as Scalar}
          // initialValue={initialValue ? (initialValue as Scalar) : undefined}
          inputDataType={queryExpression.dataType}
        />
      )}
    </>
  );
};
