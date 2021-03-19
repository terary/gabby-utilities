/**
 * Storybook seemed to have troubles with initialization.
 * The component is used only for storybook.
 */

import { ReactElement, useState } from 'react';

import { QInputSelectMultiple } from './QInputSelectMultiple';
// import { SelectOption } from '../../GenericInput';
import { SelectOption } from '../term.types';
import { Grid } from '@material-ui/core';
import { TermOperators } from '../term.types';

interface QInputSelectMultipleProps {
  formatCallbackValues?: (value: any) => object;
  formatDisplayValues?: (value: any) => string;
  inputProps?: object;
  label?: string;
  termOperator?: TermOperators;
  initialValue?: (string | number)[]; // actually its one of the data types?
  options: SelectOption[];
}
const Code = (props: any) => {
  return (
    <code>
      <pre>{props.children}</pre>
    </code>
  );
};

export const QInputSelectMultipleStory = ({
  inputProps,
  label,
  initialValue = [],
  options,
  // formatDisplayValues = (value: any) => {
  //   return `is ${value}`;
  // },
  // formatCallbackValues,
  termOperator,
}: QInputSelectMultipleProps) => {
  const [callStack, setCallStack] = useState([] as any[]);

  const handleChange = (...args: any) => {
    setCallStack(callStack.concat([args]));
  };

  return (
    <Grid container spacing={3} direction="row">
      <Grid item>
        <QInputSelectMultiple
          inputProps={inputProps}
          label={label}
          initialValue={initialValue}
          onChange={handleChange}
          termOperator={termOperator}
          options={options}
        />
        <ul>
          {callStack.map((call, idx) => (
            <li key={idx}>{JSON.stringify(call)}</li>
          ))}
        </ul>
      </Grid>
      <Grid item>
        <article>
          <h2>Properties</h2>
          <p>
            <ul>
              <li>
                <Code>
                  formatCallbackValues?: (value: (string|number)[]) =&gt; object;
                </Code>
                <figure>
                  <figcaption>
                    Determine the shape of `termValue`.
                    <br />
                    Default: <Code>(value) =&gt; &#123;$in:[value1, value2]&#125;</Code>
                  </figcaption>
                </figure>
              </li>
              <li>
                <Code>
                  formatDisplayValues?: (value: (string|number)[]) =&gt; string;
                </Code>
                <figure>
                  <figcaption>
                    Human readable label. The label part of &#123;value: label&#125;
                    <br />
                    Default: <Code>(value) =&gt; value</Code>
                  </figcaption>
                </figure>
              </li>
              <li>
                <Code>inputProps?: object;</Code>
                <figure>
                  <figcaption>Added to the html control</figcaption>
                </figure>
              </li>
              <li>
                <Code>label?: string;</Code>
                <figure>
                  <figcaption>The Label</figcaption>
                </figure>
              </li>
              <li>
                <Code>termOperator?: TermOperators;</Code>
                <figure>
                  <figcaption>
                    The operator to use for the callback termValue. Default '$in' see
                    formatCallbackValues for example.
                  </figcaption>
                </figure>
              </li>
              <li>
                <Code>initialValue?: string | number;</Code>
                <figure>
                  <figcaption>
                    Sets the control's starting value. no validity check is performed.
                    It is the responsibility of the developer to assure the value is one
                    of the option values.
                  </figcaption>
                </figure>
              </li>
              <li>
                <Code>options: SelectOption[];</Code>
                <figure>
                  <figcaption>The options of the dropdown box.</figcaption>
                </figure>
                <Code>
                  SelectOption: &#123; value: string|number, label: string &#125;
                </Code>
              </li>
            </ul>
          </p>
          <p>
            In difference to QInputSelectSingle:
            <ul>
              <li>
                <code>allowEmpty</code> is not an option. User selects or unselects an
                option. They can not select the empty option.
              </li>
              <li>
                <code>initialValue</code> is an array allowing for multiple selected
                options.
              </li>
              <li>
                Internally the value is (string | number)[]. Arrays are commonly used
                where scalar values are used in QInputSingleSelect
              </li>
            </ul>
          </p>
        </article>
      </Grid>
    </Grid>
  );
};
