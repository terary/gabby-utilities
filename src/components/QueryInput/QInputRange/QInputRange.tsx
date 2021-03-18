import { GInputPairSideBySide, Subfield, InputDataType } from '../../GenericInput';
import { IQInputChange, TermValueChangeMessageOrNull } from '../term.types';
import { presetOptions } from './presetOptions';

const onChangeNoOp = (changeMessage: TermValueChangeMessageOrNull) => {};
export const untestables = {
  onChangeNoOp,
};

interface QInputRangeProps extends IQInputChange {
  rangeOption?: 'inclusive' | 'exclusive';
  expanded?: boolean; //undocumented exposed for test/dev/debug -not expected to be externally
  formatCallbackValues?: (min: any, max: any) => any;
  formatDisplayValues?: (min: any, max: any) => string;
  inputProps?: object;
  inputDataType?: InputDataType;
  label?: string;

  // onChange?: (termValue: QueryTermValueOrNull) => void;
  subfields?: { min: Subfield; max: Subfield };
}

// TODO - add testing (probably borrow heavily from QInputPair)
// TODO - add InputDataType to testing

type ChangeValue = { [subfieldId: string]: string | number | null };

export const QInputRange = ({
  rangeOption = 'inclusive',
  expanded = false,
  inputProps = {},
  inputDataType = 'text',
  label,
  onChange = onChangeNoOp,

  subfields = presetOptions[rangeOption].subfields,
  formatDisplayValues = presetOptions[rangeOption].formatDisplayValue,
  formatCallbackValues = (min: any, max: any) => {
    return presetOptions[rangeOption].formatCallbackValue(min, max, subfields);
  },
}: QInputRangeProps) => {
  const handleChange = (newValue: ChangeValue) => {
    const { min: sfMin, max: sfMax } = subfields;
    onChange({
      termLabel: formatDisplayValues(newValue[sfMin.id], newValue[sfMax.id]),
      termValue: formatCallbackValues(newValue[sfMin.id], newValue[sfMax.id]),
    });
  };
  return (
    <GInputPairSideBySide
      expanded={expanded}
      inputProps={inputProps}
      inputDataType={inputDataType}
      label={label}
      subfields={subfields}
      formatDisplayedValues={formatDisplayValues}
      onChange={handleChange}
    />
  );
};
