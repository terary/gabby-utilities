// GenericInputDoubleValueSideBySide.stories.tsx

import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { GInputSelect } from './GInputSelect';

const options = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];

export default {
  title: 'Generic Input/Select',
  component: GInputSelect,
  args: {
    allowEmpty: true,
    allowMultiSelect: false,
    errorText: 'Remove this text to clear error',
    helperText: 'This is the help test - disappears when expanded',
    id: 'GInputSelect',
    label: 'This is the Label',
    required: true,
    startValue: 'value2',
    options,
  },
  argTypes: { onChange: { action: 'change' } },
} as Meta;

const Template: Story<ComponentProps<typeof GInputSelect>> = (args) => (
  <GInputSelect
    {...args}
    // formatDispayedValues={formatDisplayValues}
  />
);

export const SingleSelect = Template.bind({});
SingleSelect.args = {
  id: 'TheStoryID',
  /* the args you need here will depend on your component */
};
export const MultiSelect = Template.bind({});
MultiSelect.args = {
  id: 'TheStoryID',
  allowMultiSelect: true,
  startValue: ['value2'],
  /* the args you need here will depend on your component */
};
