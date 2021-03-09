import React, { ReactChild, ReactComponentElement, useState } from 'react';
import { QInputScalar } from './QInputScalar';
import { QInputPair } from './QInputPair/QInputPair';
import { QueryTermValueOrNull } from './types';

const noopOnChange = (value: string | object | null) => {};

interface QInputGenericProps {
  id: string;
  onChange?: (value: QueryTermValueOrNull) => void;
  queryTermOperator: string;
  value?: any;
  // queryTermOperator: QueryTermOperator;
}

export const QInputGeneric = ({
  id,
  onChange = noopOnChange,
  queryTermOperator,
  value,
}: QInputGenericProps) => {
  const [thisValue, setThisValue] = useState(value || '');

  const handleChange = (termValue: QueryTermValueOrNull) => {
    setThisValue(JSON.stringify(termValue?.value));
    onChange(termValue);
  };
  const handleQueryTermValueChange = (termValue: QueryTermValueOrNull) => {
    setThisValue(JSON.stringify(termValue?.value));
    onChange(termValue);
    if (queryTermOperator === 'betweenx') {
      console.log(termValue?.value);
    }

    // onChange(termValue);
  };

  return (
    <>
      {queryTermOperator === 'eq' && (
        <QInputScalar value={thisValue} onChange={handleChange} />
      )}
      {queryTermOperator === 'regex' && (
        <QInputScalar value={thisValue} onChange={handleChange} />
      )}
      {queryTermOperator === 'betweenx' && (
        <QInputPair
          presetOption="exclusive"
          id={id + '-input'}
          label="should not be required"
          onChange={handleQueryTermValueChange}
        />
      )}
      {/* {JSON.stringify(queryTermOperator)} */}
    </>
  );
};
/**
 export const QueryTermOperators = {
  eq: { longLabel: 'Equals', shortLabel: '=' },
  gt: { longLabel: 'Greater Than', shortLabel: '>' },
  lt: { longLabel: 'Less Than', shortLabel: '<' },
  regex: { longLabel: 'Contains', shortLabel: 'has' },
  betweenx: { longLabel: 'Between', shortLabel: 'from' },
  betweeni: { longLabel: 'Between and Including', shortLabel: 'from' },
} as QueryTermOperator;


    formatDispayedValues: formatDisplayValues,
    helperText: 'This is the help test - disappears when expanded',
    id: 'primaryStoryId',
    label: 'This is the Label',
    subfields: { min: minSubfield, max: maxSubfield },

*/
