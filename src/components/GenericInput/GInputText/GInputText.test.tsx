import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { GInputText } from './GInputText';
// import { DoubleValueFields } from './GInputText.types';

// const testSubfields = {
//   min: { id: 'testLow', label: 'LowerBound' },
//   max: { id: 'testHigh', label: 'UpperBound' },
// } as DoubleValueFields;

// const testSubfieldsWithInitialValue = {
//   min: { id: 'testLow', label: 'LowerBound', intialValue: 1 },
//   max: { id: 'testHigh', label: 'UpperBound', intialValue: 23 },
// } as DoubleValueFields;

describe('GInputText', () => {
  afterEach(() => {
    cleanup();
  }); // afterEach

  describe('HelperText', () => {
    it('Should not add P element if no helperText is set and no error', () => {
      act(() => {
        setupRender();
      });
      const helperP = document.querySelector('p');
      expect(helperP).not.toBeInTheDocument();
    });
    it('Should be displayed if there are no errors and control is not expanded', () => {
      act(() => {
        setupRender({ helperText: 'Client supplied helper text' });
      });

      const helperP = document.querySelector('p');
      expect(helperP).toBeInTheDocument();
      expect(helperP?.innerHTML).toBe('Client supplied helper text');
    });
    it('Should call helperText function with default fieldIds if supplied', () => {
      act(() => {
        setupRender({ helperText: 'Helper Text as a function' });
      });
      const helperP = document.querySelector('p');
      expect(helperP).toBeInTheDocument();
      expect(helperP?.innerHTML).toBe('Helper Text as a function');
    });
    it('Error text will replace helper text', () => {
      act(() => {
        setupRender({
          helperText: 'Helper Text as a function',
          errorText: 'This is an Error',
        });
      });
      const helperP = document.querySelector('p');
      expect(helperP).toBeInTheDocument();
      expect(helperP?.innerHTML).toBe('This is an Error');
    });
  });
  describe('Label', () => {
    beforeEach(() => {
      cleanup();
    });
    it('Should not be in dom if not set', () => {
      // appears Label and related stuff does get set if undefined, just empty.
      act(() => {
        setupRender({ label: null });
      });

      const label = document.querySelector('label');
      const legend = document.querySelector('legend > span');

      expect(label).toBeNull();
      expect(legend?.innerHTML).toMatch('');
    });
    it('Should be added with legend if set', () => {
      act(() => {
        setupRender({ label: 'Client Code Label' });
      });
      const label = document.querySelector('label');
      const legend = document.querySelector('legend > span');

      expect(label?.innerHTML).toBe('Client Code Label');
      expect(legend?.innerHTML).toMatch('Client Code Label');
    });
  });
  describe('onChange', () => {
    it('Should be called with default min/max fieldIds if subfields not set', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({ onChange: changeHandler });
      });

      // default isExpanded = false, click isExpanded = true
      const textBox = screen.getByRole('textbox');
      await userEvent.type(textBox, 'some text');

      expect(changeHandler).toHaveBeenCalledWith('some text');
    });
  });
  describe('Error Messages', () => {
    beforeEach(() => {
      //
    }); // beforeEach
    afterEach(() => {
      cleanup();
    }); // afterEach
    it('Should indicate error in Label', () => {
      act(() => {
        setupRender({
          helperText: 'Helper Text as a function',
          errorText: 'This is an Error',
          label: 'This is the label',
        });
      });
      const errorLabel = document.querySelector('label.Mui-error');
      expect(errorLabel).not.toBeNull();
    });
    it('Should indicate error in: ...', () => {
      act(() => {
        setupRender({
          helperText: 'Helper Text as a function',
          errorText: 'This is an Error',
        });
      });
      const errorLabel = document.querySelectorAll('.Mui-error');
      expect(errorLabel.length).toBe(2);
    });
    it('Should indicate error in helper text if present', () => {
      act(() => {
        setupRender({
          helperText: 'Helper Text as a function',
          errorText: 'This is an Error',
        });
      });
      const errorLabel = document.querySelectorAll('P.Mui-error');
      expect(errorLabel.length).toBe(1);
    });
    it('Should indicate error div surrounding textbox', () => {
      act(() => {
        setupRender({
          errorText: 'This is an Error',
        });
      });
      const errorLabel = document.querySelectorAll('div.Mui-error');
      expect(errorLabel.length).toBe(1);
    });
    it('Should *not* indicate error when not set', () => {
      act(() => {
        setupRender({});
      });
      const errorLabel = document.querySelectorAll('div.Mui-error');
      expect(errorLabel.length).toBe(0);
    });
  }); //describe('Error Messages',
  describe('misc', () => {
    it.skip('should apply or not required ', () => {});
  });
  describe('Smoke Tests', () => {
    beforeEach(() => {
      act(() => {
        setupRender({});
      });
    });
    afterEach(() => {
      cleanup();
    });
    test('Initial State only one text box', () => {
      let inputBoxes = screen.getAllByRole('textbox');
      expect(inputBoxes.length).toBe(1);
    });
  }); //describe('Smoke test...
}); // describe('GOverUnder'

// ------------------  Helperss

type PropertyObject = { [propName: string]: any };

const setupRender = (focusProps: PropertyObject = {}) => {
  const effectiveProps = {
    // ...{
    //   errorSubfields: { lowerBound: 'Low End Error', upperBound: 'High End Error' },
    // },
    ...focusProps,
  } as PropertyObject;
  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });
  return render(
    <GInputText {...effectiveProps} id={'testManyThings' + Math.random()} />
  );
};
