import React, { useState } from 'react';
import './App.css';
import {
  QInput,
  CONDITION_OPERATORS,
  UIValidatorError,
} from './components/field-types';
import {
  QSingleCondition,
  QSingleConditionChangeMessage,
} from './components/field-types/IFieldType';
import { QInputMinMax } from './components/field-types/QInputMinMax';
import {
  GenericInputDoubleValue,
  GenericInputDoubleValueFields,
} from './components/field-types/GenericInputDoubleValue';

import { DoubleValueSideBySide } from './components/field-types/generic-input/DoubleValueSideBySide';

import { ExpandLessRounded } from '@material-ui/icons';

const validatorIsValid = (...args: any[]): UIValidatorError => {
  return {
    hasError: false,
    errorText: '',
  };
};
const validatorIsInvalid = (...args: any[]): UIValidatorError => {
  return {
    hasError: true,
    errorText: 'Hard code invalid',
  };
};

// Need to test
//   -text for Help, error, label, initVal
//   -noop for callback (make then test)
const validatorNotValid = (...args: any[]): UIValidatorError => {
  return {
    hasError: true,
    errorText: 'This Has An Error',
  };
};
const testSubfieldsWithInitialValue = {
  min: { id: 'testLow', label: 'Lower Bound', intialValue: 1 },
  max: { id: 'testHigh', label: 'Upper Bound', intialValue: 23 },
} as GenericInputDoubleValueFields;

function App() {
  const [childQCondition, setCchildQCondition] = useState({} as QSingleCondition);
  const [newValue, setNewValue] = useState({} as any);
  const [genericValue, setGenericValue] = useState({} as any);
  const [subfieldErrors, setSubfielError] = useState({
    testLow: '',
    testHigh: '',
  });
  // const subfields = {
  //   min: { id: '0', label: 'Lower' },
  //   max: { id: '1', label: 'Upper' },
  // } as GenericInputDoubleValueFields;
  const subfields = {
    min: { id: 'low', label: 'LowerBound' },
    max: { id: 'high', label: 'UpperBound' },
  } as GenericInputDoubleValueFields;
  const subfieldsTopBottom = {
    min: { id: 'low', label: 'LowerBound', intialValue: '-1' },
    max: { id: 'high', label: 'UpperBound', intialValue: 12 },
  } as GenericInputDoubleValueFields;
  // const defaultSubfields = {
  //   min: { label: 'min', id: 'min' },
  //   max: { label: 'max', id: 'max' },
  // } as GenericInputDoubleValueFields;

  // export type Subfield = {
  //   label: string;
  //   id: string;
  // };
  const testSubfieldsWithInitialValue = {
    min: { id: 'testLow', label: 'Lower Bound', intialValue: 1 },
    max: { id: 'testHigh', label: 'Upper Bound', intialValue: 23 },
  } as GenericInputDoubleValueFields;

  const handleChildChange = (childMessage: QSingleConditionChangeMessage) => {
    setCchildQCondition(childMessage.condition);
  };
  const handleMaxMinChange = (maxMinVal: any) => {
    setNewValue(maxMinVal);
  };
  const handleGenericChange = (genValue: any) => {
    setGenericValue(genValue);
  };

  const toggleSubfieldErrors = () => {
    setSubfielError({
      testLow:
        Math.random() < 0.5 ? 'This is an error message MIN' + Math.random() : '',
      testHigh:
        Math.random() < 0.5 ? 'This is an error message MAX' + Math.random() : '',
    });
  };

  return (
    <div className="App">
      <div>
        <span>{JSON.stringify(childQCondition)}</span>
      </div>
      {/* <QInput
        nodeId="MyAwesomeNode"
        // validator={validatorIsValid}
        validator={validatorNotValid}
        onChange={handleChildChange}
        fieldId="TheVield"
        conditionOperator={CONDITION_OPERATORS.eq}
        // new
        id={'MyAwesomeNode:0-1-3.a'}
        // optional
        label={'This is the Label'}
        initialValue="Initial Value"
        helperText="Helper Text"
      />
      <hr /> */}
      {JSON.stringify(newValue)}
      {/* <QInputMinMax
        // nodeId="MyAwesomeNode"
        // // validator={validatorIsValid}
        // validator={validatorIsValid}
        // onChange={handleChildChange}
        // fieldId="TheVield"
        // conditionOperator={CONDITION_OPERATORS.eq}
        // // new
        // id={'MyAwesomeNode:0-1-3.a'}
        // // optional
        // label={'This is the Label'}
        // // initialValue="Initial Value"
        // helperText="Helper Text"
        onChangeParentMinMax={handleMaxMinChange}
        nodeId="MyAwesomeNode"
        validator={validatorIsValid}
        fieldId="TheField"
        conditionOperator={CONDITION_OPERATORS.eq}
        // new
        id={'MyAwesomeNode:0-1-3'}
      /> */}
      <hr />
      {JSON.stringify(genericValue)}
      <br />
      <GenericInputDoubleValue
        // value={{ testLow: 'a', testHigh: 'z' }}
        // value={genericValue}
        // helperText={(value) => 'x' + JSON.stringify(value)}
        // helperText={(value) => JSON.stringify(value)}
        // helperText="Client Set Helper Text"
        label="The Label"
        subfields={testSubfieldsWithInitialValue}
      />
      <hr />
      {JSON.stringify(subfieldErrors)}
      <br />
      <button onClick={toggleSubfieldErrors}>Set Subfield Error</button>
      <DoubleValueSideBySide
        // errorSubfields={subfieldErrors}
        // value={{ testLow: 'a', testHigh: 'z' }}}
        // value={genericValue}
        // helperText={(value) => 'x' + JSON.stringify(value)}
        // helperText={(value) => JSON.stringify(value)}
        // helperText="Client Set Helper Text"
        // label="The Labelx"
        errorSubfields={subfieldErrors}
        subfields={subfieldsTopBottom}
      />
    </div>
  );
}

export default App;
