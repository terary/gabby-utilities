import { GInputPairSideBySide, Subfield } from '../../GenericInput';
import { IQInputComponent } from '../term.types';
import { TermValueWithLabelOrNull, TermValue } from '../index';
import { presetOptions } from './presetOptions';

const onChangeNoOp = (changeMessage: TermValueWithLabelOrNull) => {};
export const untestables = {
  onChangeNoOp,
};

export interface QInputRangeProps extends IQInputComponent {
  rangeOption?: 'inclusive' | 'exclusive';
  expanded?: boolean; //undocumented exposed for test/dev/debug -not expected to be externally
  // TODO - reorganize Range, create new MinMax (think I deleted when it was called Pair)
  // TODO - min/max will support {min:null, max:null} where as Range does not
  // TODO - separate/specialization/generalization
  formatCallbackValues?: (min: any, max: any) => TermValue;
  // formatCallbackValues?: (min: any, max: any) => TermValue;
  formatDisplayValues?: (min: any, max: any) => string;
  initialValue?: object;
  subfields?: { min: Subfield; max: Subfield };
}

type ChangeValue = { [subfieldId: string]: string | number | null };

export const QInputRange = ({
  rangeOption = 'inclusive',
  expanded = false,
  initialValue,
  inputProps = {},
  inputDataType = 'text',
  label,
  onChange = onChangeNoOp,

  subfields = presetOptions[rangeOption].subfields,
  formatDisplayValues = presetOptions[rangeOption].formatDisplayValue,
  formatCallbackValues = (min: any, max: any) => {
    return presetOptions[rangeOption].formatCallbackValue(
      min,
      max,
      subfields
    ) as TermValue;
  },
}: QInputRangeProps) => {
  const handleChange = (newValue: ChangeValue) => {
    const { min: sfMin, max: sfMax } = subfields;
    const termValue = formatCallbackValues(newValue[sfMin.id], newValue[sfMax.id]);
    if (termValue === null) {
      onChange(null);
    } else {
      onChange({
        termValue: termValue,
        termLabel: formatDisplayValues(newValue[sfMin.id], newValue[sfMax.id]),
      });
    }
  };
  return (
    <GInputPairSideBySide
      expanded={expanded}
      value={initialValue}
      inputProps={inputProps}
      inputDataType={inputDataType}
      label={label}
      subfields={subfields}
      formatDisplayedValues={formatDisplayValues}
      onChange={handleChange}
    />
  );
};
