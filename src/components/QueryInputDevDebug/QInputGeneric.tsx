import React, { ReactChild, ReactComponentElement, useState } from 'react';

import { QInputScalar } from '../QueryInput/QInputScalar';
import { TermValueWithLabelOrNull } from '../QueryInput/term.types';
import { QInputSelectMultiple } from '../QueryInput/QInputSelect/QInputSelectMultiple';
import { QInputRange } from '../QueryInput/QInputRange/QInputRange';
// TermValueWithLabelOrNull
const noopOnChange = (value: string | object | null) => {};
const noopOnQueryChange = (termValue: TermValueWithLabelOrNull) => {};
const options = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];

interface QInputGenericProps {
  id: string;
  onChange?: (value: TermValueWithLabelOrNull) => void;

  onQueryTermChange: (termValue: TermValueWithLabelOrNull) => void;
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

  const handleChange2 = (termValue: TermValueWithLabelOrNull) => {
    console.log('Need finish this', termValue);
  };
  const handleQueryTermValueChange2 = (termValue: TermValueWithLabelOrNull) => {
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
