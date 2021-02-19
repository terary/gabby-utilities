import React from 'react';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { IGenericFieldCompoentPros, QSingleConditionChangeMessage } from './IFieldType';
import { ControlCamera } from '@material-ui/icons';

// Need to tease out the control from teh QueryControl

// min/max has its own thing going on.  It should only send {min/max} and/or generic lable
// and QInput shoud use that to wrap the NodeID=Op=Values

type MinMaxValueType = { min: any; max: any };
// QSingleConditionChangeMessage
export type NodeChangeValueType = { [nodeId: string]: MinMaxValueType };

const noopValidator = (v: MinMaxValueType) => {
  // const noopValidator = (...args: any[]) => {
  return { hasError: false, errorText: '' };
};

interface QInputMinMaxPros extends IGenericFieldCompoentPros {
  initialValue?: MinMaxValueType;
  // onChangeParent: typeof ({ [nodeId: string]: MinMaxValueType }) => void;
  // onChangeParent?: ({ [nodeId: string]: MinMaxValueType }) => void;
  onChangeParentMinMax?: (changeMessage: QSingleConditionChangeMessage) => void;
  // id: string;
}

const noopOnChange = (querySimpleTerm: QSingleConditionChangeMessage) => {};

export function QInputMinMax({
  conditionOperator,
  fieldId,
  id,
  initialValue = { min: '', max: '' },
  label = '',
  nodeId,

  onChangeParentMinMax = noopOnChange,
  validator = noopValidator,
}: QInputMinMaxPros) {
  const [isMin, setIsMin] = React.useState(true);
  const [thisValue, setThisValue] = React.useState(initialValue);
  const [inputError, setInputError] = React.useState(validator(initialValue));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = { ...thisValue };
    if (isMin) {
      newValue.min = e.target.value;
    } else {
      newValue.max = e.target.value;
    }
    setThisValue(newValue);
    if (!validator(newValue).hasError) {
      notifiyParent(newValue);
    }
  };

  const notifiyParent = (newValue: MinMaxValueType) => {
    const updatedCondition = {
      [fieldId]: {
        [conditionOperator]: newValue,
      },
    };

    const changeMessage = {
      nodeId: nodeId,
      condition: updatedCondition,
    } as QSingleConditionChangeMessage;

    onChangeParentMinMax(changeMessage); // if this is a copy of state and there is other stuff?
  };

  const getLabel = () => {
    const labelMinMax =
      label.length > 0 ? label + ' ' + (isMin ? '(Min.)' : '(Max.)') : '';
    return inputError.hasError ? inputError.errorText : labelMinMax;
  };

  const getPlaceholderText = () => {
    return isMin ? 'Minimum' : 'Maximum';
  };

  const toggleMaxMin = () => {
    setIsMin(!isMin);
  };

  const TheAdornment = () => {
    return (
      <InputAdornment position="end">
        <Button
          variant="contained"
          color="primary"
          aria-label="toggle password visibility"
          onClick={() => {
            toggleMaxMin();
            // console.log('AdormentClick');
          }}
          onMouseDown={() => {
            console.log('AdormentMouseOver');
          }}
        >
          {isMin ? 'Min' : 'Max'}
          {/* <Visibility /> */}
        </Button>
      </InputAdornment>
    );
  };

  return (
    <TextField
      helperText={JSON.stringify(thisValue)}
      id={id}
      InputProps={{
        endAdornment: <TheAdornment />,
        'aria-label': 'weight',
      }}
      label={getLabel()}
      onChange={handleChange}
      value={isMin ? thisValue.min : thisValue.max}
      variant="outlined"
      placeholder={getPlaceholderText()}
      // required
      // placeholder
    />
  );
}
