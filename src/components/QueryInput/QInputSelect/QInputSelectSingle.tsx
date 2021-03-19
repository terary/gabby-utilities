import { IQInputChange, TermValue, TermOperators, Scalar } from '../term.types';
import { GInputSelectSingle, SelectOption } from '../../GenericInput';

const noopOnChange = (value: any) => {};

export const untestables = {
  noopOnChange,
};

export interface QInputSelectSingleProps extends IQInputChange {
  allowEmpty?: boolean;

  formatCallbackValues?: (value: Scalar) => TermValue;
  formatDisplayValues?: (value: Scalar) => string;
  // inputDataType -- comes from the options
  initialValue?: Scalar; // actually its one of the data types?
  options: SelectOption[];
  termOperator?: TermOperators;
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
