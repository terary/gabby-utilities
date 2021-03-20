// cspell:ignore  fname lname
import React, { useState, ReactChild } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  // QueryTermOperators,
  TermValueWithLabelOrNull,
  SelectOption,
  // QFieldDataTypeEnum,
  // QFieldCollection,
} from '../QueryInput';
import { QFieldSelector } from './QFieldSelector';
import { QInputGeneric } from './QInputGeneric';

import { Grid } from '@material-ui/core';

type QueryField = {
  label: string;
  datatype: QFieldDataTypeEnum;
  UIInput?: ReactChild;
};

export type QueryTermOperator = {
  [operator: string]: {
    longLabel: string;
    shortLabel: string;
  };
};
type QFieldCollection = { [fieldId: string]: QueryField };
enum QFieldDataTypeEnum {
  DATE = 'DATE',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}
const QueryTermOperators = {
  eq: { longLabel: 'Equals', shortLabel: '=' },
  gt: { longLabel: 'Greater Than', shortLabel: '>' },
  lt: { longLabel: 'Less Than', shortLabel: '<' },
  regex: { longLabel: 'Contains', shortLabel: 'has' },
  betweenx: { longLabel: 'Between', shortLabel: 'from' },
  betweeni: { longLabel: 'Between and Including', shortLabel: 'from' },
  anyOf: { longLabel: 'Any Of', shortLabel: 'Any' },
} as QueryTermOperator;

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
  estimatedIncome: { label: 'Annual Income', datatype: QFieldDataTypeEnum.NUMBER },
  dateOfBirth: { label: 'Date of Birth', datatype: QFieldDataTypeEnum.DATE },
} as QFieldCollection;

type QueryTerm = {
  fieldId: any; //string | null;
  queryOp: any; // string | null;
  expression?: any; // object | null;
} & TermValueWithLabelOrNull;

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
const noopOnQueryChange = (termValue: TermValueWithLabelOrNull) => {};

interface QDebugDevSimpleProps {
  onChange: (queryExpression: object | null) => void;
  onQueryTermChange?: (termValue: TermValueWithLabelOrNull) => void;
}

export function QDebugDevSimple({
  onChange = noopOnChange,
  onQueryTermChange = noopOnQueryChange,
}: QDebugDevSimpleProps) {
  const classes = useStyles();
  const [queryTerm, setQueryTerm] = useState(({
    fieldId: 'lname',
    queryOp: 'regex',
    value: 'The Awesome Value',
  } as unknown) as QueryTerm);

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

  const handleInputChange = (termValue: TermValueWithLabelOrNull) => {
    const newTermValue = { ...queryTerm, ...termValue };
    // newTermValue.expression = {
    //   [newTermValue.fieldId || 'missing_filed_id']: termValue?.value,
    // };
    setQueryTerm(newTermValue);
    // if (!termValue || termValue.value === null) {
    //   onChange(null);
    // } else {
    //   newTermValue.label = makeLabel(newTermValue.label);
    //   onChange(newTermValue);
    // }
  };
  const handleQueryTermValueChange2 = (termValue: TermValueWithLabelOrNull) => {
    // setThisValue(JSON.stringify(termValue?.value));
    onQueryTermChange(termValue);
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
        {queryTerm.fieldId && queryTerm.queryOp && (
          <QInputGeneric
            id="Maybe ID is a mistake"
            queryTermOperator={queryTerm.queryOp}
            onChange={handleInputChange}
            // value={queryTerm.value || ''}
            onQueryTermChange={handleQueryTermValueChange2}
          />
        )}
      </Grid>
    </Grid>
  );
}
