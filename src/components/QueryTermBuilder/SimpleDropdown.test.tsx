import React from 'react';
import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { SimpleDropdown } from './SimpleDropdown';
const testOptions = {
  one: { id: 'one', label: 'First' },
  two: { id: 'two', label: 'Second' },
  three: { id: 'three', label: 'Third' },
};

describe('SimpleDropdown', () => {
  describe('Properties', () => {
    describe('inputProps', () => {
      it('Should be passed to the input (select) control', () => {
        act(() => {
          setupRender({ inputProps: { 'data-test': 'testing' } });
        });
        const selectBox = document.querySelectorAll('select[data-test="testing"]');
        expect(selectBox.length).toBe(1);
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
    describe('onChange', () => {
      it('Should be called with value ', () => {
        const changeHandler = jest.fn((_childChange: any) => {});

        act(() => {
          setupRender({
            options: testOptions,
            inputProps: { id: 'simpledropdown', 'data-testid': 'simpledropdown' },
            onChange: changeHandler,
          });
        });
        const simpleSelect = screen.getByTestId('simpledropdown');
        fireEvent.change(simpleSelect, { target: { value: 'two' } });
        expect(changeHandler).toHaveBeenCalledWith('two');
      });
    }); // describe(onChange...
    describe('options', () => {
      it('Should create the same number of options', () => {
        act(() => {
          setupRender({ options: testOptions });
        });
        const dropdown = screen.getByRole('combobox');
        expect(dropdown.children.length).toBe(Object.values(testOptions).length);
        // make sure test data isn't broken
        expect(Object.values(testOptions).length).toBe(3);
      });
      it('Should *not* die if undefined options', () => {
        act(() => {
          setupRender({});
        });
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });
    describe('selectedOption', () => {
      it('Should set to top (first) option if not set - eg no undefined', () => {
        act(() => {
          setupRender({ options: testOptions });
        });
        const dropdown = screen.getByRole('combobox');
        expect(dropdown).toHaveValue('one');
        expect(dropdown).not.toHaveValue('two');
        expect(dropdown).not.toHaveValue('three');
      });
      it('Should be able to set initial value (selectedOption)', () => {
        act(() => {
          setupRender({ options: testOptions, selectedOption: 'two' });
        });
        const dropdown = screen.getByRole('combobox');

        expect(dropdown).not.toHaveValue('one');
        expect(dropdown).toHaveValue('two');
        expect(dropdown).not.toHaveValue('three');
      });
    });
  }); //describe properties
  it('Should create dropdown with all supplied options', () => {});
  it('Should set first option as selected (effective always some option is selected)', () => {});
});

type PropertyObject = { [propName: string]: any };

const setupRender = (focusProps: PropertyObject = {}) => {
  const defaultProps = {
    // queryExpression: makeTestQueryExpression(),
    label: 'Test Label Not Set',
    onChange: (...arg: any) => {},
  };

  const effectiveProps = {
    ...defaultProps,
    ...focusProps,
  } as PropertyObject;

  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });
  //@ts-ignore
  return render(<SimpleDropdown {...effectiveProps} />);
};
