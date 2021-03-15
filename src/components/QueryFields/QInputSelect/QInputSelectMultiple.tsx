// import { GInputSelect } from '../GenericInput/GInputSelect/GInputSelect';
import {
  IQInputChange,
  TermValueChangeMessageOrNull,
  TermValue,
  TermOperators,
} from '../term.types';
import {
  // GInputSelectSingle,
  GInputSelectMultiple,
  // InputDataType,
  SelectOption,
} from '../../GenericInput';
import { QueryTermOperators } from '../../QueryTermBuilder/types';

const noopOnChange = (changeMessage: TermValueChangeMessageOrNull) => {};

interface QInputSelectMultipleProps extends IQInputChange {
  allowEmpty?: boolean;
  allowMultiSelect?: boolean;

  formatCallbackValues?: (value: (number | string)[]) => object;
  formatDisplayValues?: (value: (number | string)[]) => string;
  inputProps?: object;
  label?: string;
  termOperator?: TermOperators;
  initialValue?: (string | number)[]; // actually its one of the datatypes?
  options: SelectOption[];
  // onChange?: (termValue: TermValueChangeMessageOrNull) => void;
}

export const QInputSelectMultiple = ({
  // allowMultiSelect,
  inputProps,
  termOperator = '$in', // maybe only $in and $eq? $eq only valid for singleSelect, not multi Select
  label,
  initialValue = [],
  onChange = noopOnChange,
  options,
  formatDisplayValues = (value: any) => {
    return 'One of: ' + value.join(', ');
  },
  formatCallbackValues,
}: QInputSelectMultipleProps) => {
  // const termOperator = '$in';
  // const startValue: (string | number)[] = [];
  // initialValue && startValue.push(initialValue);

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
