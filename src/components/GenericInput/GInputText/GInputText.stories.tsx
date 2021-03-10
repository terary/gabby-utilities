// GenericInputDoubleValueSideBySide.stories.tsx

import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { GInputText } from './GInputText';

export default {
  title: 'Generic Input/Text',
  component: GInputText,
  args: {
    errorText: 'Remove this text to clear error',
    helperText: 'This is the help test - disappears when expanded',
    // id: 'primaryStoryId',
    label: 'This is the Label',
    required: true,
    value: 'Value can be set by Parent',
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

const Template: Story<ComponentProps<typeof GInputText>> = (args) => (
  <GInputText
    {...args}
    // formatDispayedValues={formatDisplayValues}
  />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  // id: 'TheStoryID',
  /* the args you need here will depend on your component */
};
