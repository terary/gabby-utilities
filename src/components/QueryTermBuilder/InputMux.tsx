import React from 'react';
import {
  QInputRange,
  QInputScalar,
  QInputSelectMultiple,
  QInputSelectSingle,
  SelectOption,
} from '../QueryInput';
import { QueryTermExpression, QueryTermValue } from './types';
import { TermValueWithLabel } from './index';

interface InputMuxProps {
  queryExpression: QueryTermExpression;
  label: string;
  onChange: (newValue: QueryTermValue | null) => void;
  selectOptions?: SelectOption[];
}

export const InputMux = ({
  label,
  queryExpression,
  onChange,
  selectOptions,
}: InputMuxProps) => {
  const handleValueChange = (newValue: TermValueWithLabel | null) => {
    if (newValue === null || newValue.termValue === null) {
      onChange(null);
      return;
    }
    const termValue = newValue?.termValue[queryExpression.operator];

    const qValue: QueryTermValue = {
      label: newValue?.termLabel || '',
      value: termValue,
      mongoValue: newValue?.termValue || null,
    };
    if (queryExpression.operator === '$anyOf') {
      qValue.mongoValue = { $in: qValue.value };
    }
    if (queryExpression.operator === '$oneOf') {
      qValue.value = newValue?.termValue['$eq'];
    }
    if (queryExpression.operator === '$betweenX') {
      qValue.value = newValue?.termValue || null;
    }
    if (queryExpression.operator === '$betweenI') {
      qValue.value = newValue?.termValue || null;
    }
    onChange(qValue);
  };

  return (
    <>
      {['$betweenX', '$betweenI'].indexOf(queryExpression.operator) !== -1 && (
        <QInputRange
          onChange={handleValueChange}
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
        />
      )}
      {['$betweenX', '$betweenI', '$anyOf', '$oneOf'].indexOf(
        queryExpression.operator
      ) === -1 && (
        <QInputScalar
          onChange={handleValueChange}
          label={label}
          termOperator={queryExpression.operator}
          inputDataType={queryExpression.dataType}
        />
      )}
    </>
  );
};
