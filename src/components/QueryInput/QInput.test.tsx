import React, { Component } from 'react';
import { render, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { QInput } from '../GenericInput/QInput';
import {
  CONDITION_OPERATORS,
  UIValidatorError,
  QSingleConditionChangeMessage,
} from './IFieldType';
// import { act } from 'react-dom/test-utils';

const validatorIsValid = (...args: any[]): UIValidatorError => {
  return {
    hasError: false,
    errorText: '',
  };
};
const validatorNotValid = (...args: any[]): UIValidatorError => {
  return {
    hasError: true,
    errorText: 'This Has An Error',
  };
};

// export type UIInputError = {
//   hasError: boolean;
//   errorText: string;
// }

describe('QInput', () => {
  describe('Normal Operations', () => {
    it('Should be a text input', () => {
      act(() => {
        render(
          <QInput
            nodeId="MyAwesomeNode"
            validator={validatorIsValid}
            onChange={(qCondition) => {}}
            fieldId="TheVield"
            conditionOperator={CONDITION_OPERATORS.eq}
            // new
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });
      const textInput = screen.getByRole('textbox');
      expect(textInput).toBeInTheDocument();
    });
    it('Should set an initial value if supplied', () => {
      const parentHadleChange = jest.fn(
        (childChange: QSingleConditionChangeMessage) => {}
      );
      act(() => {
        render(
          <QInput
            nodeId="MyAwesomeNode"
            validator={validatorIsValid}
            initialValue="Initial Value"
            onChange={parentHadleChange}
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            // new
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });
      expect(screen.getByRole('textbox')).toHaveValue('Initial Value');
      expect(parentHadleChange).not.toHaveBeenCalled();
    });
  });
  describe('Option Helper Text', () => {
    it('Displayed when pressent', () => {
      const dom = render(
        <QInput
          nodeId="MyAwesomeNode"
          validator={validatorIsValid}
          onChange={(qCondition) => {}}
          fieldId="TheVield"
          conditionOperator={CONDITION_OPERATORS.eq}
          // new
          id={'MyAwesomeNode_0-1-3'}
          helperText="This is the Helper Text"
        />
      );
      const helperP = dom.container.querySelector(
        '#MyAwesomeNode_0-1-3-helper-text'
      );
      expect(helperP?.constructor.name).toBe('HTMLParagraphElement');
      expect(helperP?.innerHTML).toBe('This is the Helper Text');
    });
  });
  describe('Option Label Text', () => {
    it('Displays when pressent', () => {
      const dom = render(
        <QInput
          nodeId="MyAwesomeNode"
          validator={validatorIsValid}
          onChange={(qCondition) => {}}
          fieldId="TheVield"
          conditionOperator={CONDITION_OPERATORS.eq}
          // new
          id={'MyAwesomeNode_0-1-3'}
          //options
          label="This is the Label Text"
        />
      );
      const label = dom.container.querySelector('label');
      expect(label).not.toBeNull();
      expect(label?.innerHTML).toBe('This is the Label Text');
    });
  });

  describe('Call back, onChange (see related validator)', () => {
    it('should be optional', () => {
      act(() => {
        render(
          <QInput
            nodeId="MyAwesomeNode"
            validator={validatorIsValid}
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            // new
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });
      userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
      expect(screen.getByRole('textbox')).toHaveValue('Hello, World!');
    });
    it('Should be called when present', () => {
      const parentHadleChange = jest.fn(
        (childChange: QSingleConditionChangeMessage) => {}
      );
      act(() => {
        render(
          <QInput
            nodeId="MyAwesomeNode"
            validator={validatorIsValid}
            onChange={parentHadleChange}
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            // new
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });

      const theExpected = {
        nodeId: 'MyAwesomeNode',
        condition: {
          // computed property more closely mimmics real-world
          ['TheField']: { [CONDITION_OPERATORS.eq]: 'Hello, World!' },
        },
      };

      userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
      expect(screen.getByRole('textbox')).toHaveValue('Hello, World!');
      expect(parentHadleChange).toHaveBeenCalledWith(theExpected);
    });
  });
  describe('callback validator', () => {
    it('Should be optional', () => {
      act(() => {
        render(
          <QInput
            nodeId="MyAwesomeNode"
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            // new
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });
      userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
      expect(screen.getByRole('textbox')).toHaveValue('Hello, World!');
    });
    it('Should inidate to user with, Label, Helper Text, and texfield', () => {
      const parentHadleChange = jest.fn(
        (childChange: QSingleConditionChangeMessage) => {}
      );
      // act(() => {
      const dom = render(
        <QInput
          nodeId="MyAwesomeNode"
          validator={validatorNotValid}
          onChange={parentHadleChange}
          fieldId="TheField"
          conditionOperator={CONDITION_OPERATORS.eq}
          // new
          id={'MyAwesomeNode:0-1-3'}
        />
      );
      userEvent.type(screen.getByRole('textbox'), 'Hello, World!');

      const errorEls = dom.container.querySelectorAll('.Mui-error');
      expect(errorEls.length).toBe(3);

      const errorP = dom.container.querySelectorAll('p.Mui-error');
      expect(errorP.length).toBe(1);
      expect(errorP[0].innerHTML).toBe('This Has An Error');

      const errorLabel = dom.container.querySelectorAll('label.Mui-error');
      expect(errorLabel.length).toBe(1);
      expect(errorLabel[0].innerHTML).toBe('This Has An Error');

      const errorInput = dom.container.querySelectorAll(
        'div.Mui-error > input'
      );
      expect(errorInput.length).toBe(1);
      expect(screen.getByRole('textbox')).toHaveValue('Hello, World!');
      expect(parentHadleChange).not.toHaveBeenCalled();
    });
    it('Should not call onChange in error state', () => {
      const parentHadleChange = jest.fn(
        (childChange: QSingleConditionChangeMessage) => {}
      );
      act(() => {
        render(
          <QInput
            nodeId="MyAwesomeNode"
            validator={validatorNotValid}
            onChange={parentHadleChange}
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            // new
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });

      const theExpected = {
        nodeId: 'MyAwesomeNode',
        condition: {
          ['TheField']: { [CONDITION_OPERATORS.eq]: 'Hello, World!' },
        },
      };

      userEvent.type(screen.getByRole('textbox'), 'Hello, World!');
      expect(screen.getByRole('textbox')).toHaveValue('Hello, World!');
      expect(parentHadleChange).not.toHaveBeenCalled();
    });
  });
});
