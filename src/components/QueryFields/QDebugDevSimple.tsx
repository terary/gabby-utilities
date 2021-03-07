import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { QueryTermValueOrNull } from './types';
import {
  QueryTermOperators,
  SelectOption,
  QFieldDataTypeEnum,
  QFieldCollection,
} from './types';
import { QFieldSelector } from './QFieldSelector';
// import { QInputGeneric } from './QInputGeneric';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  })
);

const fields = {
  fname: { label: 'First Name', datatype: QFieldDataTypeEnum.STRING },
  lname: { label: 'Last Name', datatype: QFieldDataTypeEnum.STRING },
  estimatedIncome: { label: 'Anual Income', datatype: QFieldDataTypeEnum.NUMBER },
  dateOfBirthe: { label: 'Date of Birth', datatype: QFieldDataTypeEnum.DATE },
} as QFieldCollection;

type QueryTerm = {
  fieldId: string | null;
  queryOp: string | null;
} & QueryTermValueOrNull;

const getQueryTermOperators = (): SelectOption[] => {
  return Object.entries(QueryTermOperators).map(([qOperator, entity], i) => {
    return { value: qOperator, label: entity.longLabel };
  });
};

const getFieldOptions = (): SelectOption[] => {
  return Object.entries(fields).map(([fieldId, entity], i) => {
    return { value: fieldId, label: entity.label };
  });
};

const noopOnChange = (queryExpression: object | null) => {};

interface QDebugDevSimpleProps {
  onChange: (queryExpression: object | null) => void;
}

export function QDebugDevSimple({ onChange = noopOnChange }: QDebugDevSimpleProps) {
  const classes = useStyles();
  const [queryTerm, setQueryTerm] = useState({
    // fieldId: 'estimatedIncome',
    // queryOp: 'betweenx',

    fieldId: 'lname',
    queryOp: 'regex',
    value: 'The Awesome Value',
  } as QueryTerm);

  const handleFieldIdChange = (newFieldId: string) => {
    const fieldId = newFieldId === '' ? null : newFieldId;

    const newQueryTerm = {
      ...queryTerm,
      ...{ fieldId },
      ...{ label: '', value: '' },
    };
    setQueryTerm(newQueryTerm as QueryTerm);
    onChange(null);
  };

  const handleQueryOpChange = (queryOp: string) => {
    const newQueryTerm = { ...queryTerm, ...{ queryOp } };
    setQueryTerm(newQueryTerm as QueryTerm);
    onChange(null);
  };

  const makeLabel = (inputValue: string) => {
    // use isEmpty
    const fieldId = queryTerm.fieldId;
    const queryOp = queryTerm.queryOp;

    if (fieldId === null || fieldId === '') {
      return '';
    }
    if (queryOp === null || queryOp === '') {
      return '';
    }
    return ` ${fields[fieldId].label} ${QueryTermOperators[queryOp].longLabel} ${inputValue}`;
  };

  const handleInputChange = (termValue: QueryTermValueOrNull) => {
    const newTermValue = { ...queryTerm, ...termValue };
    setQueryTerm(newTermValue);
    if (!termValue || termValue.value === null) {
      onChange(null);
    } else {
      newTermValue.label = makeLabel(newTermValue.label);
      onChange(newTermValue);
    }
  };

  const QueryOperatorSelector = () => {
    if (!queryTerm.fieldId) {
      return null;
    }

    return (
      <QFieldSelector
        onChange={handleQueryOpChange}
        allowEmpty={false}
        id="operatorSelector"
        label="is"
        options={getQueryTermOperators()}
        value={queryTerm.queryOp}
      />
    );
  };

  return (
    <Grid container justify="space-around" className={classes.root}>
      <Grid item xs={12} md={3}>
        <QFieldSelector
          onChange={handleFieldIdChange}
          id="fieldSelector"
          label="Field"
          options={getFieldOptions()}
          value={queryTerm.fieldId}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <QueryOperatorSelector />
      </Grid>
      <Grid item xs={12} md={6}>
        {/* {queryTerm.fieldId && queryTerm.queryOp && (
          <QInputGeneric
            id="Maybe ID is a mistake"
            queryTermOperator={queryTerm.queryOp}
            onChange={handleInputChange}
            value={queryTerm.value || ''}
          />
        )} */}
      </Grid>
    </Grid>
  );
}
