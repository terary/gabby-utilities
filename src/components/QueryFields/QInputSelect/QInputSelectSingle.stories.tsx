import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { QInputSelectSingleStory } from './QInputSelectSingleStory';

const options = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];
const formatCallbackValues = (value: any) => {
  return value;
};

export default {
  title: 'Query Input/QInputSelectSingle',
  component: QInputSelectSingleStory,
  args: {
    allowEmpty: false,
    inputProps: {},
    label: 'Single Select',
    initialValue: '',
    options,
    formatDisplayValues: (value: any) => {
      return `is ${value}`;
    },
    formatCallbackValues: formatCallbackValues,
    termOperator: '$eq',
  },
  argTypes: { onChange: { action: 'change' } },
} as Meta;

const Template: Story<ComponentProps<typeof QInputSelectSingleStory>> = (args) => (
  <QInputSelectSingleStory {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {};
