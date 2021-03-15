/**
 * Storybook seemd to have troubles with initialization.
 * The component is used only for storybook.
 */

import { useState } from 'react';

import { QInputPair } from './QInputPair';
import { Subfield } from '../../GenericInput';
import { QueryTermValueOrNull } from '../types';
import { Grid } from '@material-ui/core';

const defaultCallbackValueFormatter = (min: any, max: any) => {
  return { min, max };
};

const displayValueFormatter = (min: any, max: any) => {
  return `min: ${min}, max: ${max}`;
};

interface QInputPairStoryProps {
  presetOption?: 'minmax' | 'inclusive' | 'exclusive';
  expanded?: boolean; //undocumented exposed for test/dev/debug -not expected to be externally
  formatCallbackValues?: (min: any, max: any) => any;
  formatDisplayValues?: (min: any, max: any) => string;
  id: string;
  label?: string;
  onChange?: (termValue: QueryTermValueOrNull) => void;
  subfields?: { min: Subfield; max: Subfield };
}

export const QInputPairStory = ({
  presetOption = 'minmax',
  expanded = false,
  id,
  label,
  formatDisplayValues = displayValueFormatter,
  formatCallbackValues = defaultCallbackValueFormatter,
}: QInputPairStoryProps) => {
  const [callStack, setCallStack] = useState([] as any[]);

  const handleChange = (...args: any) => {
    setCallStack(callStack.concat([args]));
  };

  return (
    <Grid container spacing={3} direction="row">
      <Grid item>
        <QInputPair
          presetOption={presetOption}
          expanded={expanded}
          formatDisplayValues={formatDisplayValues}
          label={label}
          onChange={handleChange}
          // subfields = presetOptions[presetOption].subfields,
          formatCallbackValues={formatCallbackValues}
        />
        <ul>
          {callStack.map((call, idx) => (
            <li key={idx}>{JSON.stringify(call)}</li>
          ))}
        </ul>
      </Grid>
      <Grid item>
        <article>
          <h2>Presentation Variables</h2>
          <p>
            <ul>
              <li>expanded?: boolean</li>
              <li>label?: string;</li>
            </ul>
          </p>
          <h2>Others Variables</h2>
          <p>
            <ul>
              <li>
                <h3>id: string</h3>
              </li>
              <li>
                <h3>onChange</h3>
                <pre>
                  <code>
                    {`
        onChange: (value: QueryTermValueOrNull) => void

        QueryTermValueOrNull: 
            lable: string, ( value of formatDisplayValues)
            value: object, ( value of formatCallbackValues)
        
        onChange(null) is signal the user has cancled. Not reliable.
                    `}
                  </code>
                </pre>
              </li>
            </ul>
          </p>
          <h2>Behavior Variables</h2>
          <p>
            <ul>
              <li>
                <h3>formatCallbackValues</h3>
                <code>{`formatCallbackValues?: (min: any, max: any) => any;`}</code>
                <p>Determines shape of data for call back</p>
                Standard Options Include: <br />
                Without Null
                <pre>
                  <code>
                    {`
      (min: value, max: value) => {minFieldId: value, maxFieldId: value};
      (min: value, max: null) => {minFieldId: value};
      (min: null, max: value) => {maxFieldId: value};
      (min: null, max: null) => null;
                  `}
                  </code>
                </pre>
                and with Null
                <pre>
                  <code>
                    {`
      (min: value, max: value) => {minFieldId: value, maxFieldId: value};
      (min: value, max: null) => {minFieldId: value, maxFieldId: null};
      (min: null, max: value) => {minFieldId: null, maxFieldId: value};
      (min: null, max: null) => null;
                  `}
                  </code>
                </pre>
              </li>
              <li>
                <h3>formatDisplayValues</h3>
                <code>{`formatDisplayValues?: (min: any, max: any) => string`}</code>
                <p>User friendly label</p>
              </li>
              <li>
                <h3>subfields</h3>
                <code>{`subfields?: { min: Subfield; max: Subfield }`}</code>
                <pre>
                  <code>
                    {`
      Subfield: {
          id: string,   (referred to as fieldId)
          label: string, 
          initialValue: number|string (string recommended)  
      }
                  `}
                  </code>
                </pre>
              </li>
              <li>
                <h3>presetOption</h3>
                <code>{`presetOption?: 'minmax' | 'inclusive' | 'exclusive';`}</code>
                <p>Each sets the behavior fields to some predetermined settings.</p>
                <pre>
                  <code>
                    {`
      minmax: 
        formatDisplayValues:  (min,max)=>{__SOMETHING__} (override recommneded)
        formatCallbackValues: (min, max) => with nulls (see above)
        subfields: {
            min: { id: 'min', label: 'Lower Bound', initialValue: '' } as Subfield,
            max: { id: 'max', label: 'Upper Bound', initialValue: '' } as Subfield,
        }
      inclusive: 
        formatDisplayValues:  (min,max)=>{__SOMETHING__} (override recommneded)
        formatCallbackValues: (min, max) => without nulls (see above)
        subfields: {
          min: { id: '$gte', label: 'Greater or Equal', initialValue: '' } as Subfield,
          max: { id: '$lte', label: 'Less or Equal', initialValue: '' } as Subfield,
        }
      exclusive: 
        formatDisplayValues:  (min,max)=>{__SOMETHING__} (override recommneded)
        formatCallbackValues: (min, max) => without nulls (see above)
        subfields: {
          min: { id: '$gt', label: 'Greater than', initialValue: '' } as Subfield,
          max: { id: '$lt', label: 'Less than', initialValue: '' } as Subfield,
        }
                  `}
                  </code>
                </pre>
              </li>
            </ul>
          </p>
        </article>
      </Grid>
    </Grid>
  );
};
