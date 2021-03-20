import React from 'react';
import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { GInputSelectMulti, GInputSelectMultiProps } from './GInputSelectGeneric';
import { SelectOption } from '../types';

describe('GInputSelectMultiControl', () => {
  afterEach(() => {
    cleanup();
  }); // afterEach

  describe('Label', () => {
    beforeEach(() => {
      cleanup();
    });
    it('Should not have label, MaterialUi Spec.', () => {
      // appears Label and related stuff does get set if undefined, just empty.
      act(() => {
        setupRender({ label: null }, 'Should in Dom');
      });

      const label = document.querySelector('label');
      expect(label).toBeNull();
    });
  });
  describe('Options', () => {
    // I think cleanUp is unnecessary if the top most describe?
    it('Should hide options on render and expose them after', () => {
      const options = [
        { value: 'optTest1', label: 'Option Test One' },
        { value: 'optTest1', label: 'Option Test Two' },
        { value: 'optTest1', label: 'Option Test Three' },
      ] as SelectOption[];

      act(() => {
        setupRender({ options });
      });

      expect(screen.queryByRole('listbox')).toBeNull();

      const button = screen.getByRole('button');
      fireEvent.mouseDown(button);
      expect(screen.queryByRole('listbox', { hidden: false })).toBeTruthy();
    });
    it.skip('Should have list items count + 1 for empty when "allowEmpty" undefined', () => {
      const options = [
        { value: 'optTest1', label: 'Option Test One' },
        { value: 'optTest1', label: 'Option Test Two' },
        { value: 'optTest1', label: 'Option Test Three' },
      ] as SelectOption[];

      act(() => {
        setupRender({ options });
      });

      const button = screen.getByRole('button');
      fireEvent.mouseDown(button);
      const listbox = screen.queryByRole('listbox');
      const children = listbox?.querySelectorAll('li');

      expect(children?.length).toBe(4);
    });
    it('Should not add empty menu item when allowEmpty false', () => {
      const options = [
        { value: 'optTest1', label: 'Option Test One' },
        { value: 'optTest1', label: 'Option Test Two' },
        { value: 'optTest1', label: 'Option Test Three' },
      ] as SelectOption[];

      act(() => {
        setupRender({ options, allowEmpty: false });
      });

      const button = screen.getByRole('button');
      fireEvent.mouseDown(button);
      const listbox = screen.queryByRole('listbox');
      const children = listbox?.querySelectorAll('li');
      expect(children?.length).toBe(3);
    });
    it('Should add all options', () => {
      // test ' ' for the empty option turned out be a pain, forgoing empty option
      const optionLabels = ['Option Test One', 'Option Test Two', 'Option Test Three'];
      const options = [
        { value: 'optTest1', label: 'Option Test One' },
        { value: 'optTest1', label: 'Option Test Two' },
        { value: 'optTest1', label: 'Option Test Three' },
      ] as SelectOption[];

      act(() => {
        setupRender({ options, allowEmpty: false });
      });

      const button = screen.getByRole('button');
      fireEvent.mouseDown(button);
      const listbox = screen.queryByRole('listbox');
      const children = listbox?.querySelectorAll('li');
      children?.forEach((child) => {
        const text = child.textContent || 'NOT FOUND';
        const found = optionLabels.indexOf(text) > -1;
        expect(found).toBeTruthy();
      });
      expect(children?.length).toBe(3);
    });
  }); // describe options
  describe('onChange', () => {
    it('Should be with array if multiSelect.', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          allowMultiSelect: true,
          startValue: [],
        });
      });

      fireEvent.mouseDown(screen.getByRole('button'));
      const listbox = within(screen.getByRole('listbox'));
      fireEvent.click(listbox.getByText(/Option One/i));
      fireEvent.click(listbox.getByText(/Option Three/i));
      expect(changeHandler).toHaveBeenCalledWith(['value1', 'value3']);
    });
  });
  describe('Error Messages', () => {
    beforeEach(() => {
      //
    }); // beforeEach
    afterEach(() => {
      cleanup();
    }); // afterEach
    it('Should set class Mui-error when error text is specified. (display error is handled by wrapper)', () => {
      act(() => {
        setupRender({
          errorText: 'This is an Error',
        });
      });
      const errorLabel = document.querySelectorAll('.Mui-error');
      expect(errorLabel.length).toBe(2);
    });
    it('Should NOT set class Mui-error when no error text is specified.', () => {
      act(() => {
        setupRender({});
      });
      const errorLabel = document.querySelectorAll('.Mui-error');
      expect(errorLabel.length).toBe(0);
    });
    it('Should append Mui-Error to the containing div', () => {
      act(() => {
        setupRender({
          errorText: 'This is an Error',
        });
      });
      const errorLabel = document.querySelectorAll('div.Mui-error');
      expect(errorLabel.length).toBe(1);
    });
  }); //describe('Error Messages',
  describe('misc', () => {
    it('Should not indicate required regardless if required=true, (handled by wrapper)', () => {
      act(() => {
        setupRender({
          required: true,
        });
      });
      const errorLabel = document.querySelectorAll('.Mui-required');
      expect(errorLabel.length).toBe(0);
    });
  });
  describe('InputProps', () => {
    it.skip('Should, by default pass name/id to inputProps', () => {
      // not longer an option will need to passing Id, Name via inputProps
      act(() => {
        setupRender({ id: 'MyPropTest' });
      });
      const nameInput = document.querySelectorAll('input[id="MyPropTest"]');
      const idInput = document.querySelectorAll('input[name="MyPropTest"]');
      expect(nameInput.length).toBe(1);
      expect(idInput.length).toBe(1);
    });
    it('Should be able to override default name/id behavior', () => {
      act(() => {
        setupRender({ inputProps: { id: 'overrideId', name: 'overrideName' } });
      });
      const nameInput = document.querySelectorAll('input[id="overrideId"]');
      const idInput = document.querySelectorAll('input[name="overrideName"]');
      expect(nameInput.length).toBe(1);
      expect(idInput.length).toBe(1);
    });
    it('Should be able to override default name/id behavior', () => {
      act(() => {
        setupRender({ inputProps: { 'data-test': 'custom-data' } });
      });
      const customInput = document.querySelectorAll('input[data-test="custom-data"]');
      expect(customInput.length).toBe(1);
    });
  }); // describe input props
  describe('Smoke Tests', () => {
    beforeEach(() => {
      act(() => {
        setupRender({});
      });
    });
    afterEach(() => {
      cleanup();
    });
    test('Initial State only one button', () => {
      // this is some Material Magic - there is no actual 'select'
      // unless using the native option
      let inputBoxes = screen.getAllByRole('button');
      expect(inputBoxes.length).toBe(1);
    });
  }); //describe('Smoke test...
}); // describe('GOverUnder'

// ------------------  Helpers

type PropertyObject = { [propName: string]: any };
const options = [
  { value: 'value1', label: 'Option One' },
  { value: 'value2', label: 'Option Two' },
  { value: 'value3', label: 'Option Three' },
] as SelectOption[];

const setupRender = (
  focusProps: PropertyObject = {},
  testCaseName = 'missing test case name'
) => {
  const effectiveProps = {
    ...focusProps,
  } as PropertyObject;

  effectiveProps.id = effectiveProps.id || testCaseName;
  effectiveProps.options = effectiveProps.options || options;
  effectiveProps.startValue = effectiveProps.startValue || '';

  effectiveProps.required = false;
  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });
  return render(<GInputSelectMulti {...(effectiveProps as GInputSelectMultiProps)} />);
};
//import { GInputSelectGenericControl, GInputSelectGenericControlProps } from './GInputSelectGeneric';
