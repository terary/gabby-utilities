// GenericInputGInputPairOverUnder.stories.tsx

import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { GInputPairOverUnder } from './GInputPairOverUnder';
// import { Subfield }
// const minSubfield = { id: 'low', label: 'Lower Bound', initialValue: 1 } as Subfield;
// const maxSubfield = { id: 'high', label: 'Upper Bound', initialValue: 3 } as Subfield;

const formatDisplayValues = (min: any, max: any) => {
  return `From ${min} to ${max}`;
};
// const formatDisplayValuesBottomTop = (bottom: any, top: any) => {
//   return `Bottom ${bottom}, Top: ${top}`;
// };

// const lowHighSubfields = {
//   min: { id: 'low', label: 'Lower Bound', initialValue: 1 } as Subfield,
//   max: { id: 'high', label: 'Upper Bound', initialValue: 3 } as Subfield,
// };
// const topBottomSubfields = {
//   min: { id: 'bottom', label: 'Bottom', initialValue: '-1' },
//   max: { id: 'top', label: 'Top', initialValue: 12 },
// } as DoubleValueFields;

// const defaultSubfields = Object.assign({}, lowHighSubfields);

// const differentSubfields = {
//   default: defaultSubfields,
//   lowHigh: lowHighSubfields,
// //  topBottom: topBottomSubfields,
// };
// errorSubfields?: { [fieldId: string]: string };
// formatDisplayedValues?: (min: string | number, max: string | number) => string;
// helperText?: string | ((value: any) => string);
// id?: string;
// label?: string;
// onChange?: (newValue: any) => void; // should be <T> or something
// subfields?: { min: Subfield; max: Subfield };
// textFieldProps?: TextFieldProps;
// value?: any; // should be <T> or something?

export default {
  title: 'Generic Input/Input Pair, Over-Under',
  component: GInputPairOverUnder,
  args: {
    formatDisplayedValues: formatDisplayValues,
    helperText: 'This is the help test - disappears when expanded',
    id: 'primaryStoryId',
    label: 'This is the Label',
    // subfields: { min: minSubfield, max: maxSubfield },
    // textFieldProps: ...
    // value: { low: 9, high: 13 },
  },
  argTypes: { onChange: { action: 'change' } },
  // - not sure how/what parameters do.
  // docs mention creating an addOn to use parameters but not
  // finding other use cases.
  // parameters: {
  //   subfields: {
  //     values: [
  //       { name: 'default', value: defaultSubfields },
  //       { name: 'lowHigh:', value: lowHighSubfields },
  //       { name: 'topBottom:', value: topBottomSubfields },
  //     ],
  //   },
  // },
} as Meta;

const Template: Story<ComponentProps<typeof GInputPairOverUnder>> = (args) => (
  <GInputPairOverUnder
    {...args}
    // formatDisplayedValues={formatDisplayValues}
  />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  id: 'TheStoryID',
  /* the args you need here will depend on your component */
};
