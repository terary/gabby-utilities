import { updateLanguageServiceSourceFile } from 'typescript';
import { types } from 'util';
import { Subfield } from '../../GenericInput';
import {
  formatCallbackValueMinMax,
  // formatCallbackValueWithNulls,
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
  formatCallbackValue: typeof formatCallbackValueWithoutNull;
  // | typeof formatCallbackValueMinMax;
}
type OptionPresets = {
  [key in Options]: IPresetOptions; // Note that "key in".
};

export const presetOptions: OptionPresets = {
  exclusive: {
    subfields: {
      min: { id: '$gt', label: 'Greater than', initialValue: '' } as Subfield,
      max: { id: '$lt', label: 'Less than', initialValue: '' } as Subfield,
    },
    formatDisplayValue: formatDisplayValuesExclusive,
    formatCallbackValue: formatCallbackValueWithoutNull,
  },
  inclusive: {
    subfields: {
      min: { id: '$gte', label: 'Greater or Equal', initialValue: '' } as Subfield,
      max: { id: '$lte', label: 'Less or Equal', initialValue: '' } as Subfield,
    },
    formatDisplayValue: formatDisplayValuesInclusive,
    formatCallbackValue: formatCallbackValueWithoutNull, // default should be able to do this
  },
  minmax: {
    subfields: {
      min: { id: 'min', label: 'Lower Bound', initialValue: '' } as Subfield,
      max: { id: 'max', label: 'Upper Bound', initialValue: '' } as Subfield,
    },
    formatDisplayValue: formatDisplayValuesMinMax,
    // formatCallbackValue: formatCallbackValueMinMax,
    formatCallbackValue: formatCallbackValueWithoutNull, // default should be able to do this
    // formatCallbackValue: formatCallbackValueWithNulls,
  },
};
