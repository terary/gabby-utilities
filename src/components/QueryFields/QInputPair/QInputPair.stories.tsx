import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { QInputPairStory } from './QInputPairStory';
import { presetOptions } from './presetOptions';
import { Subfield } from '../../GenericInput';
// import { formatCallbackValueExclusive, formatCallbackValueInclusive } from './helpers';
// import { formatCallbackValueWithoutNull } from './helpers'
const customSubfields = {
  min: { id: 'low', label: 'Low', intialValue: 1 } as Subfield,
  max: { id: 'high', label: 'Hi', intialValue: 3 } as Subfield,
};
const customFormatCallbackValues = (min: any, max: any) => {
  return { x: { gt: min, lt: max } };
};

//  These (formatCallbackValue*) shouldnt be required for normal usage
//  It seems Storybook does something with initializing controls (mabye)
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
  title: 'Query Input/QInputPair/Presets-minmax',
  component: QInputPairStory,
  args: {
    // presetOption?: 'minmax' | 'inclusive' | 'exclusive';
    expanded: true,
    id: 'QInputPair',
    label: 'Query Pair',
    required: true,
    presetOption: 'minmax',

    formatCallbackValues: formatCallbackValueMinmax, // defaultCallbackValueFormatter,
    formatDisplayValues: presetOptions.minmax.formatDisplayValue, // displayValueFormatter,
    // subfields?: { min: Subfield; max: Subfield };
  },
  argTypes: { onChange: { action: 'change' } },
} as Meta;

const Template: Story<ComponentProps<typeof QInputPairStory>> = (args) => (
  <QInputPairStory {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {};

export const InclusiveStory = Template.bind({});
InclusiveStory.args = {
  presetOption: 'inclusive',
  formatCallbackValues: formatCallbackValueInclusive,
  formatDisplayValues: presetOptions.inclusive.formatDisplayValue,
};

export const ExclusiveStory = Template.bind({});
ExclusiveStory.args = {
  presetOption: 'exclusive',
  formatCallbackValues: formatCallbackValueExclusive,
  formatDisplayValues: presetOptions.exclusive.formatDisplayValue,
};

export const CustomStory = Template.bind({});
CustomStory.args = {
  subfields: customSubfields,
  formatCallbackValues: customFormatCallbackValues,
  formatDisplayValues: (min: any, max: any) => `Display: ${max}, ${min}`,
};
