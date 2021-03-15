import React from 'react';
import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
// import { fireEvent, within } from "react-testing-library";
import { screen } from '@testing-library/dom';

import { QInputSelectMultiple } from './QInputSelectMultiple';
import userEvent from '@testing-library/user-event';
const testOptions = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
];
describe('QInputSelect', () => {
  afterEach(() => {
    cleanup();
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
    it('Should honor data type of the options', () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const lastCallOnChangeArgs = {
        termLabel: 'One of: 1, 2, 3.14, date, Some String',
        termValue: { $in: [1, '2', 3.14, 'date', 'Some String'] },
      };
      const testOptions = [
        { value: 1, label: 'Integer' },
        { value: '2', label: 'String Number' },
        { value: 3.14, label: 'Decimal' },
        { value: 'date', label: 'Date' },
        { value: 'Some String', label: 'String String' },
      ];
      act(() => {
        setupRender({
          options: testOptions,
          onChange: changeHandler,
          allowMultiSelect: true,
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/Integer/i));
      fireEvent.click(listbox.getByText(/String Number/i));
      fireEvent.click(listbox.getByText(/Decimal/i));
      fireEvent.click(listbox.getByText(/Date/i));
      fireEvent.click(listbox.getByText(/String String/i));
      expect(changeHandler).toHaveBeenCalledWith(lastCallOnChangeArgs);
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
    it('Should be able to set initial value', () => {
      act(() => {
        setupRender({
          options: testOptions,
          initialValue: ['value2'],
          // onChange: changeHandler,
        });
      });

      const button = screen.getByRole('button');
      expect(button.textContent).toBe('Option Two');
    });
  });
  describe('onChange', () => {
    it('Should be called on select ', () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const lastCallOnChangeArgs = {
        termLabel: 'One of: value1, value3',
        termValue: { $in: ['value1', 'value3'] },
      };

      act(() => {
        setupRender({
          options: testOptions,
          onChange: changeHandler,
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/Option One/i));
      fireEvent.click(listbox.getByText(/Option Three/i));
      expect(changeHandler).toHaveBeenCalledWith(lastCallOnChangeArgs);
    });
    it('Should be called for each selected (multi select) ', () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const lastCallOnChangeArgs = {
        termLabel: 'One of: value1, value3',
        termValue: { $in: ['value1', 'value3'] },
      };

      act(() => {
        setupRender({
          options: testOptions,
          onChange: changeHandler,
          allowMultiSelect: true,
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/Option One/i));
      fireEvent.click(listbox.getByText(/Option Three/i));
      expect(changeHandler).toHaveBeenCalledWith(lastCallOnChangeArgs);
    });
    it.skip('Should be called for each selected (single) ', () => {
      // this is multi select - test not applicable
      const changeHandler = jest.fn((_childChange: any) => {});
      const stringArray = ['value1'];
      const expectCallbackHelper = (values: any[], label: string) => {
        return [
          {
            termLabel: label,
            termValue: { $in: values },
            // value: !min && !max ? null : { $gte: min, $lte: max },
          },
        ];
      };
      const expectedCallbacks = [
        expectCallbackHelper(stringArray, 'One of: value1'),
        expectCallbackHelper(['value3'], 'One of: value3'),
      ];

      act(() => {
        setupRender({
          options: testOptions,
          onChange: changeHandler,
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/Option One/i));
      fireEvent.click(listbox.getByText(/Option Three/i));

      expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
      expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
    });
  });
  describe('options', () => {
    it('Should add item for each option ', () => {
      act(() => {
        setupRender({
          options: testOptions,
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));
      Object.values(testOptions).forEach((text) => {
        expect(listbox.getByText(text.label)).toBeVisible();
      });
    });
  });
  describe('formatDisplayValues', () => {
    it('Should be called to format Human readable label', () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      const formatDisplayValue = (selectedValue: (string | number)[]) => {
        return `Selected value is ${selectedValue.join(', ')}`;
      };

      const lastCallOnChangeArgs = {
        termLabel: 'Selected value is value1, value3',
        termValue: expect.any(Object),
      };

      act(() => {
        setupRender({
          options: testOptions,
          onChange: changeHandler,
          formatDisplayValues: formatDisplayValue,
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/Option One/i));
      fireEvent.click(listbox.getByText(/Option Three/i));
      expect(changeHandler).toHaveBeenCalledWith(lastCallOnChangeArgs);
    });
  });
  describe('formatCallbackValues', () => {
    it('Should be called to format value Object', () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      const formatCallbackValue = (selectedValue: (string | number)[]) => {
        return { thevalue: selectedValue };
      };

      const lastCallOnChangeArgs = {
        termLabel: expect.any(String),
        termValue: { thevalue: ['value1', 'value3'] },
      };

      act(() => {
        setupRender({
          options: testOptions,
          allowMultiSelect: true,
          onChange: changeHandler,
          formatCallbackValues: formatCallbackValue,
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));

      fireEvent.click(listbox.getByText(/Option One/i));
      fireEvent.click(listbox.getByText(/Option Three/i));
      expect(changeHandler).toHaveBeenCalledWith(lastCallOnChangeArgs);
    });
  });
}); // describe('QInputSelect'

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
  //@ts-ignore
  return render(<QInputSelectMultiple {...effectiveProps} />);
};
