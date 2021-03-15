// import { GInputSelect } from '../GenericInput/GInputSelect/GInputSelect';
import {
  IQInputChange,
  TermValueChangeMessageOrNull,
  TermValue,
  TermOperators,
} from '../term.types';
import {
  GInputSelectSingle,
  GInputSelectMultiple,
  InputDataType,
  SelectOption,
} from '../../GenericInput';
import { QueryTermOperators } from '../../QueryTermBuilder/types';
// import { SelectOption } from '../types';

const noopOnChange = (value: any) => {};
// export interface GInputSelectProps extends GInputProps {
//   allowEmpty?: boolean;
//   allowMultiSelect?: boolean;
//   inputProps?: object;
//   options: SelectOption[];
//   startValue?: string[] | null;
//   onChange?: (value: string[]) => void;
// }

interface QInputSelectSingleProps extends IQInputChange {
  allowEmpty?: boolean;

  formatCallbackValues?: (value: any) => object;
  formatDisplayValues?: (value: any) => string;
  inputProps?: object;
  label?: string;
  termOperator?: TermOperators;
  initialValue?: string | number; // actually its one of the datatypes?
  options: SelectOption[];
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
}: QInputSelectSingleProps) => {
  const termOperator = '$eq';

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
      // allowMultiSelect={allowMultiSelect}
      allowEmpty={allowEmpty}
      label={label}
      inputProps={inputProps}
      options={options}
      initialValues={initialValue}
      onChange={handleChangeSingleSelect}
    />
  );
};
