import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { QInputPair } from './QInputPair';

const noopOnChange = (expressionValue: any) => {};

const testSubfieldsWithInitialValue = {
  min: { id: 'testLow', label: 'LowerBound', intialValue: 1 as string | number },
  max: { id: 'testHigh', label: 'UpperBound', intialValue: 23 as string | number },
};

describe('Properties', () => {
  describe('formatCallbackValues', () => {
    it('Should be used to format value for callback cb({label:"", value: formatCallbackValues() })', async () => {
      const expectedFirstCallback = {
        label: expect.any(String),
        value: '5/',
      };
      const expectedSecondCallback = {
        label: expect.any(String),
        value: '5/7',
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          formatCallbackValues: (min: any, max: any) => `${min}/${max}`,
        });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
  });
  describe('formatDisplayValues', () => {
    it('Should be used to format value for callback cb({label:formatDisplayValues(...), value:  ... })', async () => {
      const expectedFirstCallback = {
        label: '5 - ',
        value: expect.any(Object),
      };
      const expectedSecondCallback = {
        label: '5 - 7',
        value: expect.any(Object),
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          formatDisplayValues: (min: any, max: any) => `${min} - ${max}`,
          expanded: true,
        });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
  });
  describe('id', () => {
    it.skip('(ID no longer used) Should set child boxes with root id', () => {
      const expectedIds = [
        'MyAwesomeTestID',
        'MyAwesomeTestID-min',
        'MyAwesomeTestID-max',
      ];
      act(() => {
        setupRender({ id: 'MyAwesomeTestID', expanded: true });
      });

      // default isExpanded = false, click isExpanded = true
      const textBoxes = document.querySelectorAll('input');
      expect(textBoxes.length).toBe(3);
      textBoxes.forEach((textbox) => {
        const idx = expectedIds.indexOf(textbox.id);
        expect(idx).toBeGreaterThan(-1);
      });
    });
    it.skip('"ID" Should be required', () => {
      // editor gives issue - but maybe id not necessary?
      //  test needs to capture eror.  Console dumps ugly output but
      // everything works well
      const noOptions = () => {
        render(<QInputPair onChange={noopOnChange} />);
      };
      expect(noOptions).toThrowError();
    });
  });
  describe('Label', () => {
    it('Should accept labels for: main control and subfields', () => {
      const expectedLabels = ['Minor', 'Major', 'Test Label Main Control'];
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.label = 'Minor';
      tmpSubFields.max.label = 'Major';
      act(() => {
        setupRender({
          subfields: tmpSubFields,
          expanded: true,
          label: 'Test Label Main Control',
        });
      });
      const labels = document.querySelectorAll('label');
      expect(labels.length).toBe(3);
      labels.forEach((label) => {
        const idx = expectedLabels.indexOf(label.innerHTML);
        expect(idx).toBeGreaterThan(-1);
      });
    });
  });
  describe('presetOptions', () => {
    it('Should use inclusive settings ', async () => {
      const expectCallbackHelper = (min: any, max: any, label: string) => {
        return [
          {
            label: label,
            value: inclusiveValue(min, max),
            // value: !min && !max ? null : { $gte: min, $lte: max },
          },
        ];
      };
      const expectedCallbacks = [
        expectCallbackHelper('5', null, 'Greater or Equal to 5'),
        expectCallbackHelper('5', '7', 'Greater or Equal to 5 and Less or Equal to 7'),
        expectCallbackHelper(null, '7', 'Less or Equal to 7'),
        expectCallbackHelper(null, null, ''),
        expectCallbackHelper(null, '3', 'Less or Equal to 3'),
      ];
      const changeHandler = jest.fn((_childChange: any) => {});

      act(() => {
        setupRender({
          presetOption: 'inclusive',
          onChange: changeHandler,
          expanded: true,
        });
      });

      // userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5'); //0: min:5, max:null
      await userEvent.type(textBoxes[2], '7'); //1: min:5, max:7
      await userEvent.type(textBoxes[1], '{backspace}'); //2: min: null, max:7
      await userEvent.type(textBoxes[2], '{backspace}'); //3: null
      await userEvent.type(textBoxes[2], '3'); //4: min:null max:73

      expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
      expect(changeHandler).toHaveBeenCalledTimes(5);
    });
    it('Should use exclusive settings ', async () => {
      const expectCallbackHelper = (min: any, max: any, label: string) => {
        return [
          {
            label: label,
            value: exclusiveValue(min, max),
            // value: !min && !max ? null : { $gte: min, $lte: max },
          },
        ];
      };
      const expectedCallbacks = [
        expectCallbackHelper('5', null, 'Greater than 5'),
        expectCallbackHelper('5', '7', 'Greater than 5 and Less than 7'),
        expectCallbackHelper(null, '7', 'Less than 7'),
        expectCallbackHelper(null, null, ''),
        expectCallbackHelper(null, '3', 'Less than 3'),
      ];
      const changeHandler = jest.fn((_childChange: any) => {});

      act(() => {
        setupRender({
          presetOption: 'exclusive',
          onChange: changeHandler,
          expanded: true,
        });
      });

      // userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5'); //0: min:5, max:null
      await userEvent.type(textBoxes[2], '7'); //1: min:5, max:7
      await userEvent.type(textBoxes[1], '{backspace}'); //2: min: null, max:7
      await userEvent.type(textBoxes[2], '{backspace}'); //3: null
      await userEvent.type(textBoxes[2], '3'); //4: min:null max:73

      expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
      expect(changeHandler).toHaveBeenCalledTimes(5);
    });
  });
  describe('subfields', () => {
    it('Should be able to set initial values using subfields', () => {
      const expectedText = ['little', 'big', 'little - big'];
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.intialValue = 'little';
      tmpSubFields.max.intialValue = 'big';
      act(() => {
        setupRender({
          subfields: tmpSubFields,
          expanded: true,
          formatDisplayValues: (min: any, max: any) => `${min} - ${max}`,
        });
      });
      const inputBoxes = document.querySelectorAll('input');
      expect(inputBoxes.length).toBe(3);
      inputBoxes.forEach((input) => {
        const idx = expectedText.indexOf(input.value);
        expect(idx).toBeGreaterThan(-1);
      });
    });
    it('Should be able to set fieldIds used for call back', async () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.id = 'small';
      tmpSubFields.min.intialValue = '';
      tmpSubFields.max.id = 'big';
      tmpSubFields.max.intialValue = '';

      const expectedFirstCallback = {
        label: expect.any(String),
        value: { small: '5', big: null },
      };
      const expectedSecondCallback = {
        label: expect.any(String),
        value: { small: '5', big: '7' },
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          formatDisplayValues: (min: any, max: any) => `${min} - ${max}`,
          onChange: changeHandler,
          subfields: tmpSubFields,
        });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
    it('(callback, not subfield) Should send null in place of empty values {max/min}. And null of both are empty ', async () => {
      const expectCallbackHelper = (min: any, max: any) => {
        return [
          {
            label: expect.any(String),
            value: !min && !max ? null : { min, max },
          },
        ];
      };
      const expectedCallbacks = [
        expectCallbackHelper('5', null),
        expectCallbackHelper('5', '7'),
        expectCallbackHelper(null, '7'),
        expectCallbackHelper(null, null),
        expectCallbackHelper(null, '3'),
      ];
      const changeHandler = jest.fn((_childChange: any) => {});

      act(() => {
        setupRender({
          formatDisplayValues: (min: any, max: any) => `${min} - ${max}`,
          onChange: changeHandler,
        });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5'); //0: min:5, max:null
      await userEvent.type(textBoxes[2], '7'); //1: min:5, max:7
      await userEvent.type(textBoxes[1], '{backspace}'); //2: min: null, max:7
      await userEvent.type(textBoxes[2], '{backspace}'); //3: null
      await userEvent.type(textBoxes[2], '3'); //4: min:null max:7

      expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
      expect(changeHandler).toHaveBeenCalledTimes(5);
    });
  });
}); // describe('Properties'
describe('QInputPair', () => {
  afterEach(() => {
    cleanup();
  }); // afterEach
  describe('onChange', () => {
    it('Should $lte/$gte presetOptions "inclusive" ', async () => {
      const expectedFirstCallback = {
        label: 'Greater or Equal to 5',
        value: { $gte: '5' },
      };
      const expectedSecondCallback = {
        label: 'Greater or Equal to 5 and Less or Equal to 7',
        value: { $gte: '5', $lte: '7' },
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          presetOption: 'inclusive',
        });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
    it('Should $lte/$gte presetOptions "exclusive" ', async () => {
      const expectedFirstCallback = {
        label: 'Greater than 5',
        value: { $gt: '5' },
      };
      const expectedSecondCallback = {
        label: 'Greater than 5 and Less than 7',
        value: { $gt: '5', $lt: '7' },
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          presetOption: 'exclusive',
        });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
    // -----------------------------------------------
    it('Should set formatCallBackValues over presetOptions ', async () => {
      const expectedFirstCallback = {
        label: 'Greater than 5',
        value: '5/',
      };
      const expectedSecondCallback = {
        label: 'Greater than 5 and Less than 7',
        value: '5/7',
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          presetOption: 'exclusive',
          formatCallbackValues: (min: any, max: any) => `${min}/${max}`,
        });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith(expectedFirstCallback);
      expect(changeHandler).toHaveBeenCalledWith(expectedSecondCallback);
    });
    // -----------------------------------------------
  });
}); // QInputPair

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

  if (isEmpty(effectiveProps['id'])) {
    effectiveProps['id'] = 'TESTING_ID';
  }

  return render(
    <QInputPair
      {...effectiveProps}
      // id={effectiveProps.id}
      // onChange={effectiveProps.onChange}
    />
  );
};

const isEmpty = (value: any) => {
  if (value === null || value === undefined || value === '') return true;
  return false;
};

const inclusiveValue = (min: any, max: any) => {
  if (!isEmpty(min) && !isEmpty(max)) return { $gte: min, $lte: max };
  if (isEmpty(min) && isEmpty(max)) return null;
  if (isEmpty(min)) return { $lte: max };
  if (isEmpty(max)) return { $gte: min };
};

const exclusiveValue = (min: any, max: any) => {
  if (!isEmpty(min) && !isEmpty(max)) return { $gt: min, $lt: max };
  if (isEmpty(min) && isEmpty(max)) return null;
  if (isEmpty(min)) return { $lt: max };
  if (isEmpty(max)) return { $gt: min };
};
