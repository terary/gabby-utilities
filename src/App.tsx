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

import { GInputWrapper } from './components/GenericInput/GInputWrapper';
import { Input } from '@material-ui/core';
import {
  GInputSelect,
  GInputSelectControl,
} from './components/GenericInput/GInputSelect/GInputSelect';

import { QueryTermBuilder } from './components/QueryFields/QueryTermBuilder';
import { QInputPair } from './components/QueryFields/QInputPair/QInputPair';

// import { QInputPairMinMax } from './components/QueryFields/QInputPair/QInputPairMinMax';

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
  const [qInputCallBackStack, setQInputCallBackStack] = useState([] as string[]);
  const [newValue, setNewValue] = useState({} as any);
  const [genericValue, setGenericValue] = useState({} as any);
  const [subfieldErrors, setSubfielError] = useState({
    testLow: '',
    testHigh: '',
  });
  // qInputCallBackStack, setQInputCallBackStack
  const handlQInputPairCallback = (...args: any) => {
    // const qinputStack = Object.assign({},qInputCallBackStack);
    const stringArgs = JSON.stringify(args);
    // qInputCallBackStack.push(stringArgs);
    setQInputCallBackStack(qInputCallBackStack.concat([stringArgs]));
  };

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

  const labelTest = {
    min: { id: 'testLow', label: 'Test Max', intialValue: 1 },
    max: { id: 'testHigh', label: 'Test Max', intialValue: 23 },
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
      <div
        style={{
          margin: 'auto',
          paddingLeft: '25%',
          paddingRight: '25%',
        }}
      >
        <QueryTermBuilder />
      </div>

      <hr />
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
      <GInputPairSideBySide
        // value={{ testLow: 'a', testHigh: 'z' }}
        // value={genericValue}
        // helperText={(value) => 'x' + JSON.stringify(value)}
        // helperText={(value) => JSON.stringify(value)}
        // helperText="Client Set Helper Text"
        label="The Label"
        subfields={labelTest}
        onChange={(newValue) => {
          console.log('newVale', newValue);
        }}
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
      <hr />
      <QInputPair
        id="someId"
        label="Label is Required?"
        // formatDisplayValues={(min: any, max: any) => ``}
        // subfields={labelTest}
        presetOption="exclusive"
        // formatDisplayValues={(min: any, max: any) => `${min} - ${max}`}
        // helperText="This is helper text"
        // subfields: minorMajorFields, // { min: minSubfield, max: maxSubfield },
        onChange={handlQInputPairCallback}
      />
      {JSON.stringify(qInputCallBackStack)}
      <hr />
      <QInputPair
        id="someId"
        label="Label is Required?"
        // formatDisplayValues={(min: any, max: any) => ``}
        // subfields={labelTest}
        presetOption="minmax"
        // formatDisplayValues={(min: any, max: any) => `${min} - ${max}`}
        // helperText="This is helper text"
        // subfields: minorMajorFields, // { min: minSubfield, max: maxSubfield },
        onChange={handlQInputPairCallback}
      />
      {qInputCallBackStack}
      <hr />
    </div>
  );
}

export default App;
