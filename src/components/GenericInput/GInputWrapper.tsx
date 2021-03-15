import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { SelectOption } from './types';

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

export interface GInputProps {
  // component allowEmpty?: boolean;
  errorText?: string | undefined;
  helperText?: string;
  id?: string; // shouldnt be used? aria-label
  label?: string;
  // conponent options: SelectOption[];
  required?: boolean;
  // component startValue?: string | null;
  // onChange?: (value: string) => void;
}
interface GInputWrapperProps extends GInputProps {
  children: JSX.Element;
}
export function GInputWrapper({
  // allowEmpty = true,
  children,
  errorText,
  helperText,
  id,
  label,
  // options,
  required = false,
}: GInputWrapperProps) {
  const classes = useStyles();
  const inputProps = { id, name: id };
  const getHelperText = () => {
    return hasError() ? errorText : helperText;
  };
  const shouldUseHelperText = () => {
    return hasError() || helperText;
  };

  const hasError = () => {
    // because storybook's user control
    // no way to set errorText to undefined. non empty is consdered length
    // greater than 0.  Hence to set error without description will require
    // setting " ", emptyish string.
    return errorText !== undefined && errorText.length > 0;
  };

  return (
    <FormControl required={required} variant="outlined" className={classes.formControl}>
      {label && (
        <InputLabel error={hasError()} htmlFor={id}>
          {label}
        </InputLabel>
      )}
      {children}
      {shouldUseHelperText() && (
        <FormHelperText error={hasError()}>{getHelperText()}</FormHelperText>
      )}
    </FormControl>
  );
}
