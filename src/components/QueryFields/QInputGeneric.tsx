import React, { ReactChild, ReactComponentElement, useState } from 'react';
import { QInputScalar } from './QInputScalar';
import { GInputPairSideBySide } from '../GenericInput/';
import { QueryTermOperators, QueryTermOperator } from './types';
// import TextField, { TextFieldProps } from '@material-ui/core/TextField';

const noopOnChange = (value: string) => {};

interface QInputGenericProps {
  value?: string;
  onChange?: (value: string) => void;
  queryTermOperator: string;
  // queryTermOperator: QueryTermOperator;
}
export const QInputGeneric = ({
  value,
  onChange = noopOnChange,
  queryTermOperator,
}: QInputGenericProps) => {
  const [thisValue, setThisValue] = useState(value || '');

  const handleChange = (newValue: string) => {
    setThisValue(newValue);
    onChange(newValue);
  };

  return (
    <>
      {queryTermOperator === 'regex' && (
        <QInputScalar value={thisValue} onChange={handleChange} />
      )}
      {queryTermOperator === 'betweenx' && (
        <GInputPairSideBySide
          onChange={handleChange}
          // errorSubfields={subfieldErrors}
          // value={{ testLow: 'a', testHigh: 'z' }}}
          // value={genericValue}
          // helperText={(value) => 'x' + JSON.stringify(value)}
          // helperText={(value) => JSON.stringify(value)}
          // helperText="Client Set Helper Text"
          // label="The Labelx"
          // errorSubfields={subfieldErrors}
          // subfields={subfieldsTopBottom}
        />
      )}
      {JSON.stringify(queryTermOperator)}
    </>
  );
};
