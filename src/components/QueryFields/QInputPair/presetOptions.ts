import { Subfield } from '../../GenericInput';
import {
  formatCallbackValueMinMax,
  formatCallbackValueWithNulls,
  formatCallbackValueWithoutNull,
  //
  formatDisplayValuesExclusive,
  formatDisplayValuesInclusive,
  formatDisplayValuesMinMax,
} from './helpers';

enum Options {
  EXCLUSIVE = 'exclusive',
  INCLUSIVE = 'inclusive',
  MINMAX = 'minmax',
}
interface IPresetOptions {
  subfields: { min: Subfield; max: Subfield };
  formatDisplayValue:
    | typeof formatDisplayValuesExclusive
    | typeof formatDisplayValuesMinMax;
  formatCallbackValue:
    | typeof formatCallbackValueWithoutNull
    | typeof formatCallbackValueMinMax;
}
type OptionPresets = {
  [key in Options]: IPresetOptions; // Note that "key in".
};

export const presetOptions: OptionPresets = {
  exclusive: {
    subfields: {
      min: { id: '$gt', label: 'Greater than', intialValue: '' } as Subfield,
      max: { id: '$lt', label: 'Less than', intialValue: '' } as Subfield,
    },
    formatDisplayValue: formatDisplayValuesExclusive,
    formatCallbackValue: formatCallbackValueWithoutNull,
  },
  inclusive: {
    subfields: {
      min: { id: '$gte', label: 'Greater or Equal', intialValue: '' } as Subfield,
      max: { id: '$lte', label: 'Less or Equal', intialValue: '' } as Subfield,
    },
    formatDisplayValue: formatDisplayValuesInclusive,
    formatCallbackValue: formatCallbackValueWithoutNull, // default should be able to do this
  },
  minmax: {
    subfields: {
      min: { id: 'min', label: 'Lower Bound', intialValue: '' } as Subfield,
      max: { id: 'max', label: 'Upper Bound', intialValue: '' } as Subfield,
    },
    formatDisplayValue: formatDisplayValuesMinMax,
    // formatCallbackValue: formatCallbackValueMinMax,
    formatCallbackValue: formatCallbackValueWithNulls,
  },
};
