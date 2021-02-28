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
  value?: string;
  onChange?: (value: string) => void;
}
export function QInputScalar({ value, onChange = noopOnChange }: QInputScalarProps) {
  const classes = useStyles();
  const [thisValue, setThisValue] = useState(value || '');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value as string;
    setThisValue(newValue);
    onChange(newValue);
  };

  return (
    <TextField
      className={classes.formControl}
      id="outlined-basic"
      label="Outlined"
      variant="outlined"
      onChange={handleChange}
      value={thisValue}
    />
  );
}
