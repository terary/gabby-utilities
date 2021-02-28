import React, { ReactChild, ReactComponentElement, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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

const noopOnChange = (value: string) => {};

interface QInputScalarProps {
  errorText?: string | undefined;
  helperText?: string;
  id: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function GInputText({
  errorText,
  helperText,
  id,
  label,
  required = false,
  value,
  onChange = noopOnChange,
}: QInputScalarProps) {
  const classes = useStyles();
  const [thisValue, setThisValue] = useState(value || '');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value as string;
    setThisValue(newValue);
    onChange(newValue);
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
      id="id"
      label={label}
      variant="outlined"
      onChange={handleChange}
      required={required}
      value={thisValue}
      helperText={getHelperText()}
      error={hasError()}
    />
  );
}
