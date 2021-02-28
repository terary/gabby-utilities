import React, { useState } from 'react';
import {
  QueryTermOperators,
  SelectOption,
  QFieldDataTypeEnum,
  QFieldCollection,
} from './types';
import { QFieldSelector } from './QFieldSelector';
import { QInputGeneric } from './QInputGeneric';

const fields = {
  fname: { label: 'First Name', datatype: QFieldDataTypeEnum.STRING },
  lname: { label: 'Last Name', datatype: QFieldDataTypeEnum.STRING },
  estimatedIncome: { label: 'Anual Income', datatype: QFieldDataTypeEnum.NUMBER },
  dateOfBirthe: { label: 'Date of Birth', datatype: QFieldDataTypeEnum.DATE },
} as QFieldCollection;

type QueryTerm = {
  fieldId: null | string;
  queryOp: null | string;
  value: null | string;
};

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

export function QDebugDevSimple() {
  const [queryTerm, setQueryTerm] = useState({
    fieldId: 'lname',
    queryOp: 'regex',
    value: 'The Awesome Value',
  } as QueryTerm);
  // const [queryTerm, setQueryTerm] = useState({
  //   fieldId: null,
  //   queryOp: null,
  //   value: null,
  // } as QueryTerm);

  const handleFieldIdChange = (newFieldId: string) => {
    const fieldId = newFieldId === '' ? null : newFieldId;
    const newQueryTerm = { ...queryTerm, ...{ fieldId } };
    setQueryTerm(newQueryTerm);
  };
  const handleQueryOpChange = (queryOp: string) => {
    const newQueryTerm = { ...queryTerm, ...{ queryOp } };
    setQueryTerm(newQueryTerm);
  };
  const handleInputChange = (value: string) => {
    const newQueryTerm = { ...queryTerm, ...{ value } };
    setQueryTerm(newQueryTerm);
  };

  return (
    <div>
      <QFieldSelector
        onChange={handleFieldIdChange}
        id="fieldSelector"
        label="Field"
        options={getFieldOptions()}
        value={queryTerm.fieldId}
      />
      {queryTerm.fieldId && (
        <QFieldSelector
          onChange={handleQueryOpChange}
          allowEmpty={false}
          id="operatorSelector"
          label="is"
          options={getQueryTermOperators()}
          value={queryTerm.queryOp}
        />
      )}
      {queryTerm.fieldId && queryTerm.queryOp && (
        <QInputGeneric
          queryTermOperator={queryTerm.queryOp}
          onChange={handleInputChange}
          value={queryTerm.value || ''}
        />
      )}
      <br />
      {JSON.stringify(queryTerm)}
    </div>
  );
}
