import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { QInputScalar, untestables } from './QInputScalar';
import { TermValueWithLabelOrNull } from '../term.types';

describe('QInputScalar', () => {
  afterEach(() => {
    cleanup();
  });
  describe('Untestables for the sake of coverage only', () => {
    describe('noopOnChange', () => {
      it('Should do nothing', () => {
        expect(
          untestables.noopOnChange({} as TermValueWithLabelOrNull)
        ).toBeUndefined();
      });
    });
  });
  describe('inputProps', () => {
    it('Should be set on the base html input contorl', () => {
      act(() => {
        setupRender({
          inputProps: {
            'aria-label': 'input-props-test',
            'data-test': 'this-is-only-a-test',
          },
        });
      });
      const mainTextBox = document.querySelectorAll(
        '[data-test="this-is-only-a-test"]'
      );
      expect(mainTextBox.length).toBe(1);
      const parentLabel = screen.getByLabelText('input-props-test');
      expect(parentLabel).toBeInTheDocument();
    });
  });
  describe('inputDataType', () => {
    it('"integer" should use number (not string)  ', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      const expectedFirstCallback = {
        termLabel: '5',
        termValue: { $eq: 5 },
      };
      const expectedSecondCallback = {
        termLabel: '51',
        termValue: { $eq: 51 },
      };

      act(() => {
        setupRender({
          inputDataType: 'integer',
          onChange: changeHandler,
        });
      });

      const numberBoxes = screen.getAllByRole('spinbutton');

      await userEvent.type(numberBoxes[0], '51');

      expect(numberBoxes.length).toBe(1);
      expect(changeHandler.mock.calls.length).toBe(2);
      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
    it.skip('Should handle decimals', () => {
      //but it doesn't there is a bug react and invalid number "2." (as in 2.0);
      // see GInputText.test for more info
    });
    it.skip('Should handle dates', () => {
      // Date is not yet implemented.  Currently relying on underlying browswer support
      // Date should suppor calander and copy/paste.
    });
    it('Should support "text" string option', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      const expectedFirstCallback = {
        termLabel: '5',
        termValue: { $eq: '5' },
      };
      const expectedSecondCallback = {
        termLabel: '51',
        termValue: { $eq: '51' },
      };

      act(() => {
        setupRender({
          inputDataType: 'text',
          onChange: changeHandler,
        });
      });

      const numberBoxes = screen.getAllByRole('textbox');
      await userEvent.type(numberBoxes[0], '51');

      expect(numberBoxes.length).toBe(1);
      expect(changeHandler.mock.calls.length).toBe(2);
      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
  });

  describe('termOperator', () => {
    it('Should accept/use different termOperators', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      const expectedFirstCallback = {
        termLabel: '5',
        termValue: { $gte: '5' },
      };

      act(() => {
        setupRender({
          termOperator: '$gte',
          onChange: changeHandler,
        });
      });

      const numberBoxes = screen.getAllByRole('textbox');
      await userEvent.type(numberBoxes[0], '51');

      expect(numberBoxes.length).toBe(1);
      expect(changeHandler.mock.calls.length).toBe(2);
      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
    });
  });
  describe('label', () => {
    it('Should set both label and legend ', () => {
      act(() => {
        setupRender({
          label: 'This s a Label',
        });
      });
      const labels = document.querySelectorAll('label');
      const legends = document.querySelectorAll('legend');
      expect(labels.length).toBe(1);
      expect(labels[0].innerHTML).toBe('This s a Label');
      expect(legends.length).toBe(1);
      expect(legends[0].innerHTML).toBe('<span>This s a Label</span>');
    });
  });
  describe('initialValue', () => {
    it('Should set initial (default) value ', () => {
      act(() => {
        setupRender({
          initialValue: 'This s a value',
        });
      });
      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes.length).toBe(1);
      expect((textboxes[0] as HTMLInputElement).value).toBe('This s a value');
    });
  });
  describe('onChange, formatCallbackValues, formatDisplayValues', () => {
    it('Should call all three: onChange, formatCallbackValues, formatDisplayValues', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const formatDisplay = (x: any) => {
        return `displyFormatter(${x})`;
      };
      const formatValue = (x: any) => {
        return { valueFormatter: x };
      };
      const lastCallOnChangeArgs = {
        termLabel: `displyFormatter(51)`,
        termValue: { valueFormatter: '51' },
      };

      act(() => {
        setupRender({
          formatCallbackValues: formatValue,
          formatDisplayValues: formatDisplay,
          onChange: changeHandler,
        });
      });

      const numberBoxes = screen.getAllByRole('textbox');
      await userEvent.type(numberBoxes[0], '51');

      expect(numberBoxes.length).toBe(1);
      expect(changeHandler.mock.calls.length).toBe(2);
      expect(changeHandler).toHaveBeenCalledWith(lastCallOnChangeArgs);
    });
    test('empty values will send null', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      act(() => {
        setupRender({
          initialValue: '1',
          onChange: changeHandler,
        });
      });

      const numberBoxes = screen.getAllByRole('textbox');
      await userEvent.type(numberBoxes[0], '{backspace}');

      expect(numberBoxes.length).toBe(1);
      expect(changeHandler.mock.calls.length).toBe(1);
      expect(changeHandler).toHaveBeenCalledWith(null);
    });
  });
}); // describe('QInputScalar'

// ----------------- Helpers
type PropertyObject = { [propName: string]: any };
const setupRender = (focusProps: PropertyObject = {}) => {
  const effectiveProps = {
    ...focusProps,
    // ...{ id: 'ID_IS_REQUIRED', onChange: (min: any, max: any) => {} },
  } as PropertyObject;

  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });

  return render(<QInputScalar {...effectiveProps} />);
};
