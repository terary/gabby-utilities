import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { FormControl, InputLabel, Select } from '@material-ui/core';
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
const firstKey = (obj: object) => {
  return Object.keys(obj)[0] || '';
};

interface SimpleDropdownProps {
  inputProps?: object;
  label: string;
  onChange: (selectedId: string) => void;
  options: { [id: string]: { label: string; id: string } };
  selectedOption: string;
}

export const SimpleDropdown = ({
  inputProps,
  label,
  onChange,
  options = {},
  selectedOption = (() => {
    const op = firstKey(options);
    onChange(op);
    return op;
  })(),
}: SimpleDropdownProps) => {
  const [_selectedOption, setSelectedOption] = useState(selectedOption);
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSelectedId = event.target.value as string;
    // setSelectedSubject(newValue);
    onChange(newSelectedId);
    setSelectedOption(newSelectedId);
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        native
        value={_selectedOption}
        onChange={handleChange}
        label={label}
        inputProps={inputProps}
      >
        {Object.values(options).map((opt, index) => {
          return (
            <option key={index} value={opt.id}>
              {opt.label}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
};
