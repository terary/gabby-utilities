// GenericInputGInputPairSideBySide.stories.tsx

import React, { ComponentProps, ReactNode } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { Subfield } from './types';

const minSubfield = { id: 'low', label: 'Lower Bound', initialValue: 1 } as Subfield;
const maxSubfield = { id: 'high', label: 'Upper Bound', initialValue: 3 } as Subfield;

const lowHighSubfields = {
  min: { id: 'low', label: 'Lower Bound', initialValue: 1 } as Subfield,
  max: { id: 'high', label: 'Upper Bound', initialValue: 3 } as Subfield,
};
// const topBottomSubfields = {
//   min: { id: 'bottom', label: 'Bottom', initialValue: '-1' },
//   max: { id: 'top', label: 'Top', initialValue: 12 },
// } as DoubleValueFields;

const defaultSubfields = Object.assign({}, lowHighSubfields);

// const differentSubfields = {
//   default: defaultSubfields,
//   lowHigh: lowHighSubfields,
//   topBottom: topBottomSubfields,
// };
interface CodeProps {
  children: ReactNode;
}

const Code = (children: CodeProps) => {
  return (
    <pre>
      <code>{children.children}</code>
    </pre>
  );
};

const EmptyContainer = () => {
  return (
    <>
      <span>Empty</span>
    </>
  );
};

export default {
  title: 'TypeDocs',
  component: EmptyContainer,
  args: {
    // formatDisplayedValues: formatDisplayValues,
    // helperText: 'This is the help test - disappears when expanded',
    // id: 'primaryStoryId',
    // label: 'This is the Label',
    // subfields: { min: minSubfield, max: maxSubfield },
    // textFieldProps: ...
    // value: { low: 9, high: 13 },
  },
  // argTypes: { onChange: { action: 'change' } },
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

const Template: Story<ComponentProps<typeof EmptyContainer>> = (args) => (
  <div>
    <h3>Subfield</h3>
    <Code>
      {`
      type Subfield = {; 
        label: string; 
        id: string; 
        initialValue?: string | number;
        inputProps?: object;
      }
      `}
    </Code>
    <ul>
      <li>
        <Code>id: string</Code>
        <p>
          Parent should use this id for external references.
          <br />
          Example:
          <Code>
            callback(&#123;subfieldId1: value1, subfieldId2: value2, ...&#125;)
          </Code>
        </p>
      </li>
      <li>
        <Code>label: string</Code>
      </li>
      <li>
        <Code>initialValue?: string | number;</Code>
        <p>To be used to set initial value of subfields.</p>
      </li>
      <li>
        <Code>inputProps?: object;</Code>
        <p>
          Passed directly to the input control. &#60;input &#123;...inputProps&#125;.
          <br />
          Use-case: <span style={{ fontWeight: 'bold' }}>ariaLabel</span>
        </p>
      </li>
    </ul>
  </div>
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  id: 'TheStoryID',
  /* the args you need here will depend on your component */
};
