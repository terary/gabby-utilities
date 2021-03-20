// GenericInputDoubleValueSideBySide.stories.tsx

import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { GInputSelectSingle, GInputSelectMulti } from './GInputSelectGeneric';

const options = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];

export default {
  title: 'Generic Input/Select',
  component: GInputSelectSingle,
  args: {
    allowEmpty: true,
    errorText: 'Remove this text to clear error',
    helperText: 'This is the help test - disappears when expanded',
    id: 'GInputSelectSingle',
    label: 'This is the Label',
    required: true,
    initialValues: 'value2',
    options,
  },
  argTypes: { onChange: { action: 'change' } },
} as Meta;

const TemplateSingle: Story<ComponentProps<typeof GInputSelectSingle>> = (args) => (
  <GInputSelectSingle {...args} />
);

const TemplateMultiple: Story<ComponentProps<typeof GInputSelectMulti>> = (args) => (
  <GInputSelectMulti {...args} />
);

export const SingleSelect = TemplateSingle.bind({});
SingleSelect.args = {
  id: 'TheStoryIDSingle',
  /* the args you need here will depend on your component */
};
export const MultiSelect = TemplateMultiple.bind({});
MultiSelect.args = {
  id: 'TheStoryIDMultiple',
  initialValues: ['value2'],
  /* the args you need here will depend on your component */
};
