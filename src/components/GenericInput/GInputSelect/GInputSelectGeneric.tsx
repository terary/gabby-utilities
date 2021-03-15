import React, { useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { SelectOption } from '../types';
import { GInputWrapper, GInputProps } from '../GInputWrapper';

const noopOnChange = (value: any) => {};

// TODO - remove id
type AllowedTypes = (string | number) | (string | number)[];

export interface GInputSelectPublicProps<T extends AllowedTypes> extends GInputProps {
  inputProps?: object;
  options: SelectOption[];
  initialValues?: T | null;
  onChange?: (value: T) => void;
}
interface GInputSelectGenericProps<T extends AllowedTypes>
  extends GInputSelectPublicProps<T> {
  allowMultiSelect?: boolean;
  allowEmpty?: boolean;
}

function GInputSelectGenericControl<T extends AllowedTypes>({
  allowEmpty,
  allowMultiSelect,
  errorText,
  helperText,
  inputProps,
  label,
  options = [],
  // required = false,
  initialValues,
  onChange = noopOnChange,
}: GInputSelectGenericProps<T>) {
  /* mostly because prettiers not always more readable */

  const [thisValue, setThisValue] = useState(initialValues as T);
  // const [thisValue, setThisValue] = useState(startValue);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as T;
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
      inputProps={inputProps}
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

function GInputSelectGeneric<T extends AllowedTypes>(
  thisProps: GInputSelectGenericProps<T>
) {
  return (
    <GInputWrapper {...thisProps}>
      <GInputSelectGenericControl {...thisProps} />
    </GInputWrapper>
  );
}
// ----------------  Specializaion  - single
export interface GInputSelectSingleProps
  extends GInputSelectPublicProps<string | number> {
  allowEmpty: boolean;
}

export function GInputSelectSingle(props: GInputSelectSingleProps) {
  const effectiveProps = Object.assign({}, { initialValues: '' }, props);
  return <GInputSelectGeneric<string | number> {...effectiveProps} />;
}
// ----------------  Specializaion  - multiple
export interface GInputSelectMultiProps
  extends GInputSelectPublicProps<(string | number)[]> {}

export function GInputSelectMulti(props: GInputSelectMultiProps) {
  // multiSelect - has select or no selected, no empty
  const effectiveProps = Object.assign(
    {},
    { initialValues: [], allowMultiSelect: true, allowEmptys: false },
    props
  );
  return <GInputSelectGeneric<(string | number)[]> {...effectiveProps} />;
}
