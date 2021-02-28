import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { render } from '@testing-library/react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import { SelectOption, QFieldDataTypeEnum, QFieldCollection } from './types';

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

interface QFieldSelectorProps {
  options: SelectOption[];
  id: string;
  label?: string;
  allowEmpty?: boolean;
  onChange?: (value: string) => void;
  value?: string | null;
}
export function QFieldSelector({
  allowEmpty = true,
  id,
  options,
  label,
  onChange = noopOnChange,
  value = '',
}: QFieldSelectorProps) {
  const [thisValue, setThisValue] = useState(value);
  const classes = useStyles();
  const inputProps = { id, name: id };
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string;
    setThisValue(newValue);
    onChange(newValue);
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select
        // native
        // value={state.age}
        // onChange={handleChange}
        value={thisValue}
        onChange={handleChange}
        label={label}
        inputProps={inputProps}
      >
        {allowEmpty && <option key={-1} value="" />}
        {options.map((opt, index) => {
          return (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
}
