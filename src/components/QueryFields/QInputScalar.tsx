import React, { ReactChild, ReactComponentElement, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { QueryTermValueOrNull } from './types';

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

const noopOnChange = (termValue: QueryTermValueOrNull) => {};

interface QInputScalarProps {
  value?: string;
  onChange?: (termValue: QueryTermValueOrNull) => void;
}
export function QInputScalar({ value, onChange = noopOnChange }: QInputScalarProps) {
  const classes = useStyles();
  const [thisTermValue, setThisTermValue] = useState({} as QueryTermValueOrNull);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let tempTermValue = {
      label: event.target.value,
      value: event.target.value,
    } as QueryTermValueOrNull;
    setThisTermValue(tempTermValue);

    if (!tempTermValue || tempTermValue?.value === '') {
      onChange({ label: '', value: null });
    } else {
      onChange(tempTermValue);
    }
  };

  return (
    <TextField
      className={classes.formControl}
      id="outlined-basic"
      label="Outlined"
      variant="outlined"
      onChange={handleChange}
      value={thisTermValue?.value || ''}
    />
  );
}
