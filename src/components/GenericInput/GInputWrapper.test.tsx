import React from 'react';
import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { GInputWrapper } from './GInputWrapper';
import { SelectOption } from './types';
import { Input, MenuItem, Select } from '@material-ui/core';

describe('GInputWrapper', () => {
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
    it.skip('Testing should be done at component', () => {});
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
          helperText: 'Helper Text',
          errorText: 'This is an Error',
          label: 'This is the label',
        });
      });
      const errorLabel = document.querySelector('label.Mui-error');
      expect(errorLabel).not.toBeNull();
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
    test.skip('left for component Initial State only one button', () => {
      // this is some Material Magic - there is no actual 'select'
      // unless using the native option
      let inputBoxes = screen.getAllByRole('button');
      expect(inputBoxes.length).toBe(1);
    });
  }); //describe('Smoke test...
}); // describe('GOverUnder'

// ------------------  Helpers

type PropertyObject = { [propName: string]: any };

const setupRender = (focusProps: PropertyObject = {}) => {
  const effectiveProps = {
    ...focusProps,
  } as PropertyObject;

  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });

  return render(
    <GInputWrapper
      required={false}
      {...effectiveProps}
      id={'testManyThings' + Math.random()}
    >
      <span> Anything should do</span>
    </GInputWrapper>
  );
};
