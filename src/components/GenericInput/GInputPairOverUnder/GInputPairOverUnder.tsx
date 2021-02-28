import React from 'react';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

type MinMaxValueType = { min: any; max: any };

export type NodeChangeValueType = { [nodeId: string]: MinMaxValueType };

const noopOnChange = (values: object) => {};

type Subfield = {
  label: string;
  id: string;
  intialValue?: string | number;
};

export type GInputPairOverUnderFields = {
  min: Subfield;
  max: Subfield;
};

const defaultSubfields = {
  min: { label: 'min', id: 'min' },
  max: { label: 'max', id: 'max' },
} as GInputPairOverUnderFields;

const extractValue = (updateValue: any, subfields: GInputPairOverUnderFields) => {
  const newValue = { ...updateValue };
  newValue[subfields.min.id] = updateValue[subfields.min.id];
  newValue[subfields.max.id] = updateValue[subfields.max.id];
  return newValue;
};

interface GInputPairOverUnderProps {
  helperText?: string | ((value: any) => string);
  id?: string;
  isExpanded?: boolean;
  label?: string;
  onChange?: (newValue: any) => void; // should be <T> or something
  subfields?: { min: Subfield; max: Subfield };
  textFieldProps?: TextFieldProps;
  value?: any; // should be <T> or something?
}

export function GInputPairOverUnder({
  helperText,
  id,
  isExpanded = false,
  label = '',
  subfields = defaultSubfields,
  textFieldProps = {},
  onChange = noopOnChange,
  value,
}: GInputPairOverUnderProps) {
  const [focusedField, setFocusedField] = React.useState(subfields.min);
  const [thisValue, setThisValue] = React.useState(
    extractValue(
      value || {
        [subfields.min.id]: subfields.min.intialValue || '',
        [subfields.max.id]: subfields.max.intialValue || '',
      },
      subfields
    )
  );
  const getHelperText = () => {
    if (typeof helperText === 'function') {
      return helperText({
        [subfields.min.id]: thisValue[subfields.min.id],
        [subfields.max.id]: thisValue[subfields.max.id],
      });
    }
    return helperText;
  };

  const effectiveTextFieldProps = {
    label,
    helperText: getHelperText(),
    placeholder: focusedField.label, // not sure why this works, but it seems to
    required: false,
    variant: 'outlined' as 'outlined', // typescript objects if I dont do it this way.
  };

  Object.assign(effectiveTextFieldProps, textFieldProps);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = { ...thisValue };
    newValue[focusedField.id] = e.target.value;

    setThisValue(newValue);
    onChange(newValue);
  };

  const toggleMaxMin = () => {
    if (focusedField.id === subfields.max.id) {
      setFocusedField(subfields.min);
    } else {
      setFocusedField(subfields.max);
    }
  };

  const TheAdornment = () => {
    return (
      <InputAdornment position="end">
        <Button
          size="small"
          variant="contained"
          color="primary"
          aria-label="toggle password visibility"
          onClick={toggleMaxMin}
          onMouseDown={() => {
            // maybe useful in the future
          }}
        >
          {focusedField.label}
        </Button>
      </InputAdornment>
    );
  };

  return (
    <>
      <TextField
        id={id}
        InputProps={{
          endAdornment: <TheAdornment />,
        }}
        onChange={handleChange}
        value={thisValue[focusedField.id]}
        {...effectiveTextFieldProps}
      />
    </>
  );
}
