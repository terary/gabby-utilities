import React, { ReactChild, ReactComponentElement, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputDataType } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

type CallbackArgs = string | number | undefined;

const noopOnChange = (value: CallbackArgs) => {};

interface QInputScalarProps {
  errorText?: string | undefined;
  helperText?: string;
  // id: string;
  inputDataType?: InputDataType;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: CallbackArgs) => void;
}

export function GInputText({
  errorText,
  helperText,
  // id,
  inputDataType = 'text',
  label,
  required = false,
  value,
  onChange = noopOnChange,
}: QInputScalarProps) {
  const classes = useStyles();
  const [thisValue, setThisValue] = useState((value || '') as CallbackArgs);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value as CallbackArgs; // this should be number/string?
    // this will never be perfect....??
    // if decimal|float and end user wishes to clear field, onChange
    //
    setThisValue(cast(newValue));
    onChange(cast(newValue));
  };

  const cast = (value: CallbackArgs) => {
    if (inputDataType === 'integer' && !isNaN(parseInt(value as string))) {
      return parseInt(value as string);
    }

    if (inputDataType === 'decimal' && !isNaN(parseFloat(value as string))) {
      return parseFloat(value as string);
    }
    return value;
  };

  const getHelperText = () => {
    return hasError() ? errorText : helperText;
  };

  const hasError = () => {
    // because storybook's user control
    // no way to set errorText to undefined. non empty is consdered length
    // greater than 0.  Hence to set error without description will require
    // setting " ", emptyish string.
    return errorText !== undefined && errorText.length > 0;
  };

  return (
    <TextField
      className={classes.formControl}
      // id="id"
      error={hasError()}
      helperText={getHelperText()}
      label={label}
      onChange={handleChange}
      required={required}
      type={
        inputDataType === 'integer' || inputDataType === 'decimal'
          ? 'number'
          : inputDataType
      }
      value={thisValue}
      variant="outlined"
    />
  );
}
