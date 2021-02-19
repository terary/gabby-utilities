// GenericInputDoubleValueSideBySide.stories.tsx

import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { DoubleValueSideBySide } from './DoubleValueSideBySide';
import { DoubleValueFields, Subfield } from './DoubleValueSideBySide.types';

const minSubfield = { id: 'low', label: 'Lower Bound', intialValue: 1 } as Subfield;
const maxSubfield = { id: 'high', label: 'Upper Bound', intialValue: 3 } as Subfield;

const formatDisplayValues = (min: any, max: any) => {
  return `From ${min} to ${max}`;
};
const formatDisplayValuesBottomTop = (bottom: any, top: any) => {
  return `Bottom ${bottom}, Top: ${top}`;
};

const lowHighSubfields = {
  min: { id: 'low', label: 'Lower Bound', intialValue: 1 } as Subfield,
  max: { id: 'high', label: 'Upper Bound', intialValue: 3 } as Subfield,
};
const topBottomSubfields = {
  min: { id: 'bottom', label: 'Bottom', intialValue: '-1' },
  max: { id: 'top', label: 'Top', intialValue: 12 },
} as DoubleValueFields;

const defaultSubfields = Object.assign({}, lowHighSubfields);

const differentSubfields = {
  default: defaultSubfields,
  lowHigh: lowHighSubfields,
  topBottom: topBottomSubfields,
};
// errorSubfields?: { [fieldId: string]: string };
// formatDispayedValues?: (min: string | number, max: string | number) => string;
// helperText?: string | ((value: any) => string);
// id?: string;
// label?: string;
// onChange?: (newValue: any) => void; // should be <T> or something
// subfields?: { min: Subfield; max: Subfield };
// textFieldProps?: TextFieldProps;
// value?: any; // should be <T> or something?

export default {
  title: 'GenericInput/DoubleValueFields',
  component: DoubleValueSideBySide,
  args: {
    formatDispayedValues: formatDisplayValues,
    helperText: 'This is the help test - disappears when expanded',
    id: 'primaryStoryId',
    label: 'This is the Label',
    subfields: { min: minSubfield, max: maxSubfield },
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

const Template: Story<ComponentProps<typeof DoubleValueSideBySide>> = (args) => (
  <DoubleValueSideBySide
    {...args}
    // formatDispayedValues={formatDisplayValues}
  />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  id: 'TheStoryID',
  /* the args you need here will depend on your component */
};
export const ExpandedStory = Template.bind({});
ExpandedStory.args = {
  id: 'TheStoryID2',
  label: 'Differnt Min/Max',
  // initialValue seems to work in the live component but not in storybook
  // maybe something to do with storybook re/render.
  // Storybook calls with the original values substituting these
  // changing min/max ids causes conflict
  subfields: topBottomSubfields,
  formatDispayedValues: formatDisplayValuesBottomTop,
  value: { bottom: -32, top: 100 },
  expanded: true,
  // value: { bottom: 9, top: 13 },
  /* the args you need here will depend on your component */
};
export const ErrorStory = Template.bind({});
ErrorStory.args = {
  id: 'TheStoryID3',
  label: 'Errors',
  // initialValue seems to work in the live component but not in storybook
  // maybe something to do with storybook re/render.
  // Storybook calls with the original values substituting these
  // changing min/max ids causes conflict
  subfields: topBottomSubfields,
  formatDispayedValues: formatDisplayValuesBottomTop,
  value: { bottom: 100, top: -32 },
  expanded: false,
  errorSubfields: { bottom: 'is Greater than top', top: 'is less than bottom' },
  // value: { bottom: 9, top: 13 },
  /* the args you need here will depend on your component */
};
