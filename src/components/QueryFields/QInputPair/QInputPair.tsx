import { GInputPairSideBySide, Subfield } from '../../GenericInput';
import { QueryTermValueOrNull } from '../types';
import { presetOptions } from './presetOptions';

// const presets = presetOptions.exclusive;
const onChangeNoOp = (x?: any, y?: any) => {};
interface QInputPairProps {
  presetOption?: 'minmax' | 'inclusive' | 'exclusive';
  expanded?: boolean; //undocumented exposed for test/dev/debug -not expected to be externally
  formatCallbackValues?: (min: any, max: any) => any;
  formatDisplayValues?: (min: any, max: any) => string;
  id: string;
  label?: string;
  onChange?: (termValue: QueryTermValueOrNull) => void;
  subfields?: { min: Subfield; max: Subfield };
}

type ChangeValue = { [subfieldId: string]: string | number | null };

export const QInputPair = ({
  presetOption = 'minmax',
  expanded = false,
  id,
  label,
  onChange = onChangeNoOp,

  subfields = presetOptions[presetOption].subfields,
  formatDisplayValues = presetOptions[presetOption].formatDisplayValue,
  formatCallbackValues = (min: any, max: any) => {
    return presetOptions[presetOption].formatCallbackValue(min, max, subfields);
  },
}: QInputPairProps) => {
  const handleChange = (newValue: ChangeValue) => {
    const { min: sfMin, max: sfMax } = subfields;
    onChange({
      label: formatDisplayValues(newValue[sfMin.id], newValue[sfMax.id]),
      value: formatCallbackValues(newValue[sfMin.id], newValue[sfMax.id]),
    });
  };
  return (
    <GInputPairSideBySide
      expanded={expanded}
      id={id}
      label={label}
      subfields={subfields}
      formatDispayedValues={formatDisplayValues}
      onChange={handleChange}
    />
  );
};