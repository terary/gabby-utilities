import { Subfield } from '../../GenericInput';

/*
Just to keep main file less congested.

*/
export const isEmpty = (v: any) => v === undefined || v === null || v === '';

export const formatDisplayValuesMinMax = (min: any, max: any): string => {
  switch (true) {
    case isEmpty(min) && isEmpty(max):
      return '';
    case !isEmpty(min) && !isEmpty(max):
      return `From ${min} to ${max}`;
    case !isEmpty(min):
      return `From ${min}`;
    case !isEmpty(max):
      return `Upto ${max}`;
    default:
      return '';
  }
};

export const formatDisplayValuesInclusive = (min: any, max: any): string => {
  switch (true) {
    case isEmpty(min) && isEmpty(max):
      return '';
    case !isEmpty(min) && !isEmpty(max):
      return `Greater or Equal to ${min} and Less or Equal to ${max}`;
    case !isEmpty(min):
      return `Greater or Equal to ${min}`;
    case !isEmpty(max):
      return `Less or Equal to ${max}`;
    default:
      return '';
  }
};
export const formatDisplayValuesExclusive = (min: any, max: any): string => {
  switch (true) {
    case isEmpty(min) && isEmpty(max):
      return '';
    case !isEmpty(min) && !isEmpty(max):
      return `Greater than ${min} and Less than ${max}`;
    case !isEmpty(min):
      return `Greater than ${min}`;
    case !isEmpty(max):
      return `Less than ${max}`;
    default:
      return '';
  }
};

// *****************   formatCallback
// used
export const formatCallbackValueWithNulls = (
  min: any,
  max: any,
  { min: sfMin, max: sfMax }: { min: Subfield; max: Subfield }
) => {
  if (isEmpty(min) && isEmpty(max)) {
    return null;
  }

  return {
    [sfMin.id]: isEmpty(min) ? null : min,
    [sfMax.id]: isEmpty(max) ? null : max,
  };
};
//used
export const formatCallbackValueWithoutNull = (
  min: any,
  max: any,
  { min: sfMin, max: sfMax }: { min: Subfield; max: Subfield }
) => {
  switch (true) {
    case !isEmpty(min) && !isEmpty(max):
      return { [sfMin.id]: min, [sfMax.id]: max };
    case !isEmpty(min):
      return { [sfMin.id]: min };
    case !isEmpty(max):
      return { [sfMax.id]: max };
    default:
      return null;
  }
};
//used
export const formatCallbackValueMinMax = (min: any, max: any) => {
  // hardcoded min/max
  if (isEmpty(min) && isEmpty(max)) {
    return null;
  }

  return {
    min: isEmpty(min) ? null : min,
    max: isEmpty(max) ? null : max,
  };
};
