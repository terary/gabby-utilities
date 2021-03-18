// cspell:ignore datatypes
import {
  IQInputChange,
  TermValueChangeMessageOrNull,
  TermValue,
  TermOperators,
} from '../term.types';
import { GInputSelectMultiple, SelectOption } from '../../GenericInput';

const noopOnChange = (changeMessage: TermValueChangeMessageOrNull) => {};
export const untestables = {
  noopOnChange,
};

interface QInputSelectMultipleProps extends IQInputChange {
  formatCallbackValues?: (value: (number | string)[]) => object;
  formatDisplayValues?: (value: (number | string)[]) => string;
  inputProps?: object;
  label?: string;
  termOperator?: TermOperators;
  initialValue?: (string | number)[]; // actually its one of the datatypes?
  options: SelectOption[];
  // onChange?: from IQInputChange
}

export const QInputSelectMultiple = ({
  inputProps,
  termOperator = '$in',
  label,
  initialValue = [],
  onChange = noopOnChange,
  options,
  formatDisplayValues = (value: any) => {
    return 'One of: ' + value.join(', ');
  },
  formatCallbackValues,
}: QInputSelectMultipleProps) => {
  const defaultFormatCallbackValues = (value: any) => {
    return { [termOperator]: value };
  };

  const effectiveFormatCallbackValues =
    formatCallbackValues || defaultFormatCallbackValues;

  const handleChangeMultiSelect = (values: any[]) => {
    if (!values || !values.length || values.length === 0) {
      onChange(null);
    } else {
      onChange({
        termLabel: formatDisplayValues(values),
        termValue: effectiveFormatCallbackValues(values) as TermValue,
      });
    }
  };

  return (
    <GInputSelectMultiple
      label={label}
      inputProps={inputProps}
      options={options}
      initialValues={initialValue}
      onChange={handleChangeMultiSelect}
    />
  );
};
