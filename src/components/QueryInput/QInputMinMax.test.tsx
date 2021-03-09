import React, { Component } from 'react';
import { render, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { QInputMinMax } from './QInputMinMax';
import {
  CONDITION_OPERATORS,
  UIValidatorError,
  // NodeChangeValueType,
  // NodeChangeValueType,

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
          <QInputMinMax
            nodeId="MyAwesomeNode"
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
      const initVal = { min: '7', max: '12' };
      let dom: any;
      act(() => {
        dom = render(
          <QInputMinMax
            nodeId="MyAwesomeNode"
            validator={validatorIsValid}
            initialValue={initVal}
            // onChange={parentHadleChange}
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            // new
            id={'MyAwesomeNode_0-1-3'}
          />
        );
      });
      const helperP = dom.container.querySelector('#MyAwesomeNode_0-1-3-helper-text');
      expect(helperP?.constructor.name).toBe('HTMLParagraphElement');
      expect(helperP?.innerHTML).toBe(JSON.stringify(initVal));
      expect(screen.getByRole('textbox')).toHaveValue(initVal.min);

      // expect(parentHadleChange).not.toHaveBeenCalled();
    });
  });
  describe('Option Helper Text', () => {
    it('Displayed initial value', () => {
      const dom = render(
        <QInputMinMax
          nodeId="MyAwesomeNode"
          validator={validatorIsValid}
          // onChange={(qCondition) => {}}
          fieldId="TheVield"
          conditionOperator={CONDITION_OPERATORS.eq}
          // new
          id={'MyAwesomeNode_0-1-3'}
          helperText="This is the Helper Text"
        />
      );
      const helperP = dom.container.querySelector('#MyAwesomeNode_0-1-3-helper-text');
      expect(helperP?.constructor.name).toBe('HTMLParagraphElement');
      expect(helperP?.innerHTML).toBe(JSON.stringify({ min: '', max: '' }));
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });
  describe('Optional Label Text', () => {
    it('Should displays when pressent, will append Max/Min as apropos', () => {
      const dom = render(
        <QInputMinMax
          nodeId="MyAwesomeNode"
          validator={validatorIsValid}
          // onChange={(qCondition) => {}}
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
      expect(label?.innerHTML).toBe('This is the Label Text (Min.)');
      userEvent.click(screen.getByRole('button'));
      expect(label?.innerHTML).toBe('This is the Label Text (Max.)');
    });
    it('Should not displays when not pressent', () => {
      const dom = render(
        <QInputMinMax
          nodeId="MyAwesomeNode"
          validator={validatorIsValid}
          // onChange={(qCondition) => {}}
          fieldId="TheVield"
          conditionOperator={CONDITION_OPERATORS.eq}
          // new
          id={'MyAwesomeNode_0-1-3'}
          //options
          // label="This is the Label Text"
        />
      );
      const label = dom.container.querySelector('label');
      expect(label).toBeNull();
      expect(label?.innerHTML).toBeUndefined();
      userEvent.click(screen.getByRole('button'));
      expect(label?.innerHTML).toBeUndefined();
    });
  });

  describe('Call back, onChange (see related validator)', () => {
    it('Should be optional - will render without onChange', () => {
      act(() => {
        render(
          <QInputMinMax
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
    it('Should be called when present', async () => {
      const parentHadleChange = jest.fn((_childChange: any) => {});
      act(() => {
        render(
          <QInputMinMax
            nodeId="MyAwesomeNode"
            validator={validatorIsValid}
            onChangeParentMinMax={parentHadleChange}
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            onChangeParent={parentHadleChange}
            // new
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });

      const theExpected = {
        nodeId: 'MyAwesomeNode',
        condition: {
          // computed property more closely mimmics real-world
          ['TheField']: { [CONDITION_OPERATORS.eq]: { min: '3', max: '' } },
        },
      };

      await userEvent.type(screen.getByRole('textbox'), '3');
      expect(parentHadleChange).toHaveBeenCalledWith(theExpected);

      theExpected.condition['TheField'][CONDITION_OPERATORS.eq].max = '5';
      userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '5');
      expect(parentHadleChange).toHaveBeenCalledWith(theExpected);
    });
  });
  describe('callback validator', () => {
    it('Should be optional', async () => {
      const parentHadleChange = jest.fn((_childChange: any) => {});
      act(() => {
        render(
          <QInputMinMax
            nodeId="MyAwesomeNode"
            validator={validatorNotValid}
            onChangeParentMinMax={parentHadleChange}
            fieldId="TheField"
            conditionOperator={CONDITION_OPERATORS.eq}
            onChangeParent={parentHadleChange}
            // new//
            id={'MyAwesomeNode:0-1-3'}
          />
        );
      });

      const theExpected = {
        nodeId: 'MyAwesomeNode',
        condition: {
          // computed property more closely mimmics real-world
          ['TheField']: { [CONDITION_OPERATORS.eq]: { min: '3', max: '' } },
        },
      };

      await userEvent.type(screen.getByRole('textbox'), '3');
      expect(parentHadleChange).not.toHaveBeenCalledWith();

      theExpected.condition['TheField'][CONDITION_OPERATORS.eq].max = '5';
      userEvent.click(screen.getByRole('button'));

      await userEvent.type(screen.getByRole('textbox'), '5');
      expect(parentHadleChange).not.toHaveBeenCalledWith();
    });
  });
});
