import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { QInputRangeStory } from './QInputRangeStory';
import { presetOptions } from './presetOptions';
import { Subfield } from '../../GenericInput';

// TODO  - fix spelling of initialValue -> initialValue

const customSubfields = {
  min: { id: 'low', label: 'Low', initialValue: 1 } as Subfield,
  max: { id: 'high', label: 'Hi', initialValue: 3 } as Subfield,
};
const customFormatCallbackValues = (min: any, max: any) => {
  return { x: { gt: min, lt: max } };
};

//  These (formatCallbackValue*) shouldn't be required for normal usage
//  It seems Storybook does something with initializing controls (maybe)
const formatCallbackValueMinmax = (min: any, max: any) => {
  return presetOptions.minmax.formatCallbackValue(
    min,
    max,
    presetOptions.minmax.subfields
  );
};
const formatCallbackValueInclusive = (min: any, max: any) => {
  return presetOptions.inclusive.formatCallbackValue(
    min,
    max,
    presetOptions.inclusive.subfields
  );
};
const formatCallbackValueExclusive = (min: any, max: any) => {
  return presetOptions.exclusive.formatCallbackValue(
    min,
    max,
    presetOptions.exclusive.subfields
  );
};

export default {
  title: 'Query Input/QInputRange',
  component: QInputRangeStory,
  args: {
    // presetOption?: 'minmax' | 'inclusive' | 'exclusive';
    expanded: true,
    label: 'Query Pair',
    required: true,
    rangeOption: 'inclusive',
    inputDataType: 'text',
    formatCallbackValues: formatCallbackValueMinmax, // defaultCallbackValueFormatter,
    formatDisplayValues: presetOptions.minmax.formatDisplayValue, // displayValueFormatter,
    // subfields?: { min: Subfield; max: Subfield };
  },
  argTypes: { onChange: { action: 'change' } },
} as Meta;

const Template: Story<ComponentProps<typeof QInputRangeStory>> = (args) => (
  <QInputRangeStory {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {};

export const InclusiveStory = Template.bind({});
InclusiveStory.args = {
  rangeOption: 'inclusive',
  formatCallbackValues: formatCallbackValueInclusive,
  formatDisplayValues: presetOptions.inclusive.formatDisplayValue,
};

export const ExclusiveStory = Template.bind({});
ExclusiveStory.args = {
  rangeOption: 'exclusive',
  formatCallbackValues: formatCallbackValueExclusive,
  formatDisplayValues: presetOptions.exclusive.formatDisplayValue,
};

export const CustomStory = Template.bind({});
CustomStory.args = {
  subfields: customSubfields,
  formatCallbackValues: customFormatCallbackValues,
  formatDisplayValues: (min: any, max: any) => `Display: ${max}, ${min}`,
};
