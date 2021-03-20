import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { QInputSelectMultipleStory } from './QInputSelectMultipleStory';

const options = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];
const formatCallbackValues = (value: any) => {
  return value;
};

export default {
  title: 'Query Input/QInputSelectMultiple',
  component: QInputSelectMultipleStory,
  args: {
    initialValue: [],
    inputProps: {},
    label: 'Multiple',
    options,
    formatDisplayValues: (value: any) => {
      return `is ${value}`;
    },
    formatCallbackValues: formatCallbackValues,
  },
  argTypes: { onChange: { action: 'change' } },
} as Meta;

const Template: Story<ComponentProps<typeof QInputSelectMultipleStory>> = (args) => (
  <QInputSelectMultipleStory {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {};
