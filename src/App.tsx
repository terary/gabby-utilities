import React, { useState } from 'react';
import './App.css';
import { UIValidatorError } from './components/QueryInput/IFieldType';
import {
  QSingleCondition,
  QSingleConditionChangeMessage,
} from './components/QueryInput/IFieldType';

import {
  GInputPairOverUnder,
  GInputPairOverUnderFields,
  GInputPairSideBySide,
} from './components/GenericInput';

import { QDebugDevSimple } from './components/QueryFields/QDebugDevSimple';
import { GInputWrapper } from './components/GenericInput/GInputWrapper';
import { Input } from '@material-ui/core';
import {
  GInputSelect,
  GInputSelectControl,
} from './components/GenericInput/GInputSelect/GInputSelect';

const GInputSelectOptions = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];

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
} as GInputPairOverUnderFields;

function App() {
  const [childQCondition, setCchildQCondition] = useState({} as QSingleCondition);
  const [selectedOptions, setSelectedOptions] = useState([] as string[]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptionGeneric, setSelectedOptionGeneric] = useState('');
  const [newValue, setNewValue] = useState({} as any);
  const [genericValue, setGenericValue] = useState({} as any);
  const [subfieldErrors, setSubfielError] = useState({
    testLow: '',
    testHigh: '',
  });
  // const subfields = {
  //   min: { id: '0', label: 'Lower' },
  //   max: { id: '1', label: 'Upper' },
  // } as GInputPairOverUnderFields;
  const subfields = {
    min: { id: 'low', label: 'LowerBound' },
    max: { id: 'high', label: 'UpperBound' },
  } as GInputPairOverUnderFields;
  const subfieldsTopBottom = {
    min: { id: 'low', label: 'LowerBound', intialValue: '-1' },
    max: { id: 'high', label: 'UpperBound', intialValue: 12 },
  } as GInputPairOverUnderFields;
  // const defaultSubfields = {
  //   min: { label: 'min', id: 'min' },
  //   max: { label: 'max', id: 'max' },
  // } as GInputPairOverUnderFields;

  // export type Subfield = {
  //   label: string;
  //   id: string;
  // };
  const testSubfieldsWithInitialValue = {
    min: { id: 'testLow', label: 'Lower Bound', intialValue: 1 },
    max: { id: 'testHigh', label: 'Upper Bound', intialValue: 23 },
  } as GInputPairOverUnderFields;

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
      <br />
      <GInputPairOverUnder
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
      <GInputPairSideBySide
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
      <hr />
      <QDebugDevSimple />
      <hr />
      <GInputWrapper required={false} label="This is my label" id="someId">
        {/* <Select>
          <MenuItem>Something</MenuItem>
        </Select> */}
        <Input
          defaultValue="Hello world"
          inputProps={{ 'aria-label': 'description' }}
        />
      </GInputWrapper>
      <hr />

      <GInputSelect
        onChange={setSelectedOptions}
        options={GInputSelectOptions}
        allowMultiSelect={true}
        id="TheSelect"
      />
      {JSON.stringify(selectedOptions)}
      <hr />
      <GInputSelectControl
        required={true}
        errorText="Error"
        id="naked"
        label="The Label"
        inputProps={{ 'data-test': 'unit-testing' }}
        options={GInputSelectOptions}
      />
    </div>
  );
}

export default App;
