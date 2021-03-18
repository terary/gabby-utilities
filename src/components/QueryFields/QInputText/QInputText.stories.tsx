// GenericInputDoubleValueSideBySide.stories.tsx

import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { QInputTextStory } from './QInputTextStory';

export default {
  title: 'Query Input/Scalar',
  component: QInputTextStory,
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

const Template: Story<ComponentProps<typeof QInputTextStory>> = (args) => (
  <QInputTextStory {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {};
