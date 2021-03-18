/**
 * Storybook seemed to have troubles with initialization.
 * The component is used only for storybook.
 */

import { useState } from 'react';
import { Grid } from '@material-ui/core';
import { QInputScalar } from './QInputScalar';
import { TermOperators } from '../term.types';
import { InputDataType } from '../../GenericInput';

interface QInputScalarStoryProps {
  formatCallbackValues?: (value: any) => object;
  formatDisplayValues?: (value: any) => string;
  inputProps?: object;
  inputDataType?: InputDataType;
  label?: string;
  termOperator?: TermOperators;
  initialValue?: string | number;
}
const Code = (props: any) => {
  return (
    <code>
      <pre>{props.children}</pre>
    </code>
  );
};

export function QInputScalarStory({
  formatCallbackValues,
  formatDisplayValues,
  // inputProps?: object;
  inputDataType = 'text',
  label = 'Story Example',
  termOperator = '$eq',
  initialValue = '' as string,
}: QInputScalarStoryProps) {
  const [callStack, setCallStack] = useState([] as any[]);

  const handleChange = (...args: any) => {
    setCallStack(callStack.concat([args]));
  };

  return (
    <Grid container spacing={3} direction="row">
      <Grid item>
        <QInputScalar
          formatCallbackValues={formatCallbackValues}
          formatDisplayValues={formatDisplayValues}
          initialValue={initialValue}
          inputDataType={inputDataType}
          label={label}
          onChange={handleChange}
          termOperator={termOperator}
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
                <Code>formatCallbackValues?: (value: any) =&gt; object;</Code>
                <figure>
                  <figcaption>
                    Determine the shape of `termValue`.
                    <br />
                    Default: <Code>(value) =&gt; &#123;$eq:value&#125;</Code>
                  </figcaption>
                </figure>
              </li>
              <li>
                <Code>formatDisplayValues?: (value: any) =&gt; string;</Code>
                <figure>
                  <figcaption>
                    Human readable label. The label part of &#123;value: label&#125;
                    <br />
                    Default: <Code>(value) =&gt; value</Code>
                  </figcaption>
                </figure>
              </li>
              <li>
                <Code>inputDataType?: InputDataType</Code>
                <figure>
                  <figcaption>
                    Determine data type to be echoed back. Text, integer, decimal, date{' '}
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
                    The operator to use for the callback termValue. Default '$eq' see
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
            </ul>
          </p>
        </article>
      </Grid>
    </Grid>
  );
}
