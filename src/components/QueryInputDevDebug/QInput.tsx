import TextField from '@material-ui/core/TextField';
import { getByLabelText } from '@testing-library/react';
import { useState } from 'react';
import {
  IFieldComponentPros,
  CONDITION_OPERATORS,
  QSingleConditionChangeMessage,
} from './IFieldType';
// export interface IFieldComponentPros {
//   conditionOperator: CONDITION_OPERATORS;
//   fieldId: string;
//   helperText?: string;
//   id: string;
//   initialValue?: string;
//   label?: string;
//   nodeId: string;
//   onChange: (qCondition: QSingleConditionChangeMessage) => void;
//   validator: (...args: any[]) => UIValidatorError;
// }

// export type QSingleConditionChangeMessage = {
//   nodeId: string;
//   condition: QSingleCondition;
// };
// export type QSingleCondition = {
//   [fieldId: string]: {
//     [op in CONDITION_OPERATORS]: object | string | number | null; // dates will be represented as strings
//   };
// };

const noopOnChange = (qCondition: QSingleConditionChangeMessage) => {};
const noopValidator = (...args: any[]) => {
  return { hasError: false, errorText: '' };
};

export const QInput = ({
  conditionOperator,
  fieldId,
  helperText = '',
  id,
  initialValue = '',
  label = '',
  nodeId,
  onChange = noopOnChange,
  validator = noopValidator,
}: IFieldComponentPros) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [inputError, setInputError] = useState(validator(initialValue));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const validInput = validator(newValue);
    if (!validInput.hasError) {
      const condition = { [fieldId]: { [conditionOperator]: newValue } };
      const parentMessage = { nodeId, condition };
      onChange(parentMessage as QSingleConditionChangeMessage);
    }

    setInputError(validInput);
  };

  const getLabel = () => {
    return inputError.hasError ? inputError.errorText : label;
  };

  const getHelperText = () => {
    return inputError.hasError ? inputError.errorText : helperText;
  };

  return (
    <TextField
      error={inputError.hasError}
      id={id}
      label={getLabel()}
      // defaultValue={inputValue} use value or Default value (controlled or uncontrolled)
      onChange={handleChange}
      helperText={getHelperText()}
      value={inputValue}
    />
  );
};
