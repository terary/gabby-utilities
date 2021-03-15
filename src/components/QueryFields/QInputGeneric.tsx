import React, { ReactChild, ReactComponentElement, useState } from 'react';

import { QInputText } from './QInputText/QInputText';
import { QueryTermValueOrNull } from './types';
import { TermValueChangeMessageOrNull } from './term.types';
import { QInputSelectMultiple } from './QInputSelect/QInputSelectMultiple';
import { QInputRange } from './QInputPair/QInputRange';
// TermValueChangeMessageOrNull
const noopOnChange = (value: string | object | null) => {};
const noopOnQueryChange = (termValue: TermValueChangeMessageOrNull) => {};
const options = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];

interface QInputGenericProps {
  id: string;
  onChange?: (value: QueryTermValueOrNull) => void;

  onQueryTermChange: (termValue: TermValueChangeMessageOrNull) => void;
  queryTermOperator: string;
  value?: any;
  // queryTermOperator: QueryTermOperator;
}

export const QInputGeneric = ({
  id,
  onChange = noopOnChange,
  onQueryTermChange,
  queryTermOperator,
  value,
}: QInputGenericProps) => {
  const [thisValue, setThisValue] = useState(value || '');

  const handleChange2 = (termValue: TermValueChangeMessageOrNull) => {
    console.log('Need finish this', termValue);
  };
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
  const handleQueryTermValueChange2 = (termValue: TermValueChangeMessageOrNull) => {
    // setThisValue(JSON.stringify(termValue?.value));
    onQueryTermChange(termValue);

    // onChange(termValue);
  };

  return (
    <>
      {/**
       * havent tested below. Was useing QInputScalar.  Also prettier re-arranged
       * some of the code anding "()".
       */}
      {queryTermOperator === 'eq' && (
        <QInputText initialValue="" onChange={handleChange2} />
      )}
      {queryTermOperator === 'regex' && (
        <QInputText initialValue="" onChange={handleChange2} />
      )}
      {queryTermOperator === 'betweenx' && (
        <QInputRange
          rangeOption="exclusive"
          label="should not be required"
          onChange={handleQueryTermValueChange2}
        />
      )}
      {queryTermOperator === 'betweeni' && (
        <QInputRange
          rangeOption="inclusive"
          label="should not be required"
          onChange={handleQueryTermValueChange2}
        />
      )}
      {queryTermOperator === 'anyOf' && (
        <QInputSelectMultiple
          options={options}
          label="Any Of"
          onChange={handleQueryTermValueChange2}
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
