import React, { ReactChild, ReactComponentElement, useState } from 'react';

import { QInputScalar } from './QInputScalar';
import { QueryTermValueOrNull } from './term.types';
import { TermValueChangeMessageOrNull } from './term.types';
import { QInputSelectMultiple } from './QInputSelect/QInputSelectMultiple';
import { QInputRange } from './QInputRange/QInputRange';
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
       * haven't tested below. Was using QInputScalar.  Also prettier re-arranged
       * some of the code adding "()".
       */}
      {queryTermOperator === 'eq' && (
        <QInputScalar initialValue="" onChange={handleChange2} />
      )}
      {queryTermOperator === 'regex' && (
        <QInputScalar initialValue="" onChange={handleChange2} />
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
