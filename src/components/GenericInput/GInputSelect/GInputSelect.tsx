import React, { useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { SelectOption } from '../types';
import { GInputWrapper, GInputProps } from '../GInputWrapper';

const noopOnChange = (value: string[]) => {};

export interface GInputSelectProps extends GInputProps {
  allowEmpty?: boolean;
  allowMultiSelect?: boolean;
  inputProps?: object;
  options: SelectOption[];
  startValue?: string[] | null;
  onChange?: (value: string[]) => void;
}

export function GInputSelectControl({
  allowEmpty = true,
  allowMultiSelect = false,
  errorText,
  helperText,
  id,
  inputProps,
  label,
  options = [],
  // required = false,
  startValue = [],
  onChange = noopOnChange,
}: GInputSelectProps) {
  /* mostly because prettiers not always more readable */

  const [thisValue, setThisValue] = useState(startValue);
  const effectiveInputProps = Object.assign({}, { id, name: id }, inputProps);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string[];
    setThisValue(newValue);
    onChange(newValue);
  };

  const getHelperText = () => {
    return hasError() ? errorText : helperText;
  };

  const hasError = () => {
    // because storybook's user control
    // no way to set errorText to undefined. non empty is consdered length
    // greater than 0.  Hence to set error without description will require
    // setting " ", emptyish string.
    return errorText !== undefined && errorText.length > 0;
  };

  return (
    <Select
      error={hasError()}
      inputProps={effectiveInputProps}
      label={label}
      multiple={allowMultiSelect}
      onChange={handleChange}
      placeholder={getHelperText()}
      value={thisValue}
    >
      {allowEmpty && <MenuItem key={-1}>&nbsp;</MenuItem>}
      {options.map((opt, index) => {
        return (
          <MenuItem key={index} value={opt.value}>
            {opt.label}
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function GInputSelect(thisProps: GInputSelectProps) {
  return (
    <GInputWrapper {...thisProps}>
      <GInputSelectControl {...thisProps} />
    </GInputWrapper>
  );
}
