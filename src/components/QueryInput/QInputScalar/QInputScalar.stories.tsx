// GenericInputDoubleValueSideBySide.stories.tsx

import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { QInputScalarStory } from './QInputScalarStory';

export default {
  title: 'Query Input/Scalar',
  component: QInputScalarStory,
  args: {
    // formatCallbackValues?: (value: any) => object;
    // formatDisplayValues?: (value: any) => string;
    inputDataType: 'text',
    label: 'This is the Label',
    termOperator: '$eq',
    initialValue: 'Value can be set by Parent',
  },
  argTypes: { onChange: { action: 'change' } },
} as Meta;

const Template: Story<ComponentProps<typeof QInputScalarStory>> = (args) => (
  <QInputScalarStory {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {};
