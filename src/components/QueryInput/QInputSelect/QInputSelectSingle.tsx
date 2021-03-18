import { IQInputChange, TermValue, TermOperators } from '../term.types';
import { GInputSelectSingle, SelectOption } from '../../GenericInput';

const noopOnChange = (value: any) => {};

export const untestables = {
  noopOnChange,
};

interface QInputSelectSingleProps extends IQInputChange {
  allowEmpty?: boolean;

  formatCallbackValues?: (value: any) => object;
  formatDisplayValues?: (value: any) => string;
  inputProps?: object;
  initialValue?: string | number; // actually its one of the data types?
  label?: string;
  options: SelectOption[];
  termOperator?: TermOperators;
  // onChange?: (termValue: TermValueChangeMessageOrNull) => void;
}

export const QInputSelectSingle = ({
  allowEmpty = false,
  inputProps,
  label,
  initialValue = '',
  onChange = noopOnChange,
  options,
  formatDisplayValues = (value: any) => {
    return `is ${value}`;
  },
  formatCallbackValues,
  termOperator = '$eq',
}: QInputSelectSingleProps) => {
  const defaultFormatCallbackValues = (value: any) => {
    return { [termOperator]: value };
  };

  const effectiveFormatCallbackValues =
    formatCallbackValues || defaultFormatCallbackValues;

  const handleChangeSingleSelect = (value: any) => {
    if (!value || value === '') {
      onChange(null);
    } else {
      onChange({
        termLabel: formatDisplayValues(value),
        termValue: effectiveFormatCallbackValues(value) as TermValue,
      });
    }
  };

  return (
    <GInputSelectSingle
      allowEmpty={allowEmpty}
      label={label}
      inputProps={inputProps}
      options={options}
      initialValues={initialValue}
      onChange={handleChangeSingleSelect}
    />
  );
};
