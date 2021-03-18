import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Subfield } from '../../../common/types';
import { QInputRange, untestables } from './QInputRange';
import { TermValueChangeMessageOrNull } from '../term.types';

const noopOnChange = (expressionValue: any) => {};
type StringOrNumberOrNull = string | number | null;
const testSubfieldsWithInitialValue = {
  min: {
    id: 'testLow',
    label: 'LowerBound',
    initialValue: 1 as string | number,
  } as Subfield,
  max: {
    id: 'testHigh',
    label: 'UpperBound',
    initialValue: 23 as string | number,
  } as Subfield,
};

describe('Untestables for the sake of coverage only', () => {
  describe('noopOnChange', () => {
    it('Should do nothing', () => {
      expect(
        untestables.onChangeNoOp({} as TermValueChangeMessageOrNull)
      ).toBeUndefined();
    });
  });
});
describe('Properties', () => {
  describe('formatCallbackValues', () => {
    it('Should be used to format value for callback cb({label:"", value: formatCallbackValues() })', async () => {
      const expectedFirstCallback = {
        termLabel: expect.any(String),
        termValue: '5/',
      };
      const expectedSecondCallback = {
        termLabel: expect.any(String),
        termValue: '5/7',
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
        termLabel: '5 - ',
        termValue: expect.any(Object),
      };
      const expectedSecondCallback = {
        termLabel: '5 - 7',
        termValue: expect.any(Object),
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
  describe('inputProps', () => {
    it('Should be passed trough to the underlying control', () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.inputProps = { 'aria-label': 'Minor' };
      tmpSubFields.max.inputProps = { 'aria-label': 'Major' };

      act(() => {
        setupRender({
          inputProps: {
            'aria-label': 'input-props-test',
            'data-test': 'this-is-only-a-test',
          },
          subfields: tmpSubFields,
        });
      });

      const mainTextBox = document.querySelectorAll(
        '[data-test="this-is-only-a-test"]'
      );
      expect(mainTextBox.length).toBe(1);

      const textBoxes = document.querySelectorAll('input');
      expect(textBoxes.length).toBe(3);

      const parentLabel = screen.getByLabelText('input-props-test');
      const lowEndLabel = screen.getByLabelText('Minor');
      const highEndLabel = screen.getByLabelText('Major');
      expect(parentLabel).toBeInTheDocument();
      expect(lowEndLabel).toBeInTheDocument();
      expect(highEndLabel).toBeInTheDocument();
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
            termLabel: label,
            termValue: inclusiveValue(min, max),
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
          rangeOption: 'inclusive',
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
            termLabel: label,
            termValue: exclusiveValue(min, max),
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
          rangeOption: 'exclusive',
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
      tmpSubFields.min.initialValue = 'little';
      tmpSubFields.max.initialValue = 'big';
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
      tmpSubFields.min.initialValue = '';
      tmpSubFields.max.id = 'big';
      tmpSubFields.max.initialValue = '';

      const expectedFirstCallback = {
        termLabel: expect.any(String),
        termValue: { small: '5' },
      };
      const expectedSecondCallback = {
        termLabel: expect.any(String),
        termValue: { small: '5', big: '7' },
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
      const expectCallbackHelper = (
        $gte: StringOrNumberOrNull,
        $lte: StringOrNumberOrNull
      ) => {
        let values: { [key: string]: any } | null = {};
        if ($gte !== null) {
          values['$gte'] = $gte;
        }
        if ($lte !== null) {
          values['$lte'] = $lte;
        }
        if (!$gte && !$lte) {
          values = null;
        }
        return [
          {
            termLabel: expect.any(String),
            termValue: values,
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
      expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
    });
  });
}); // describe('Properties'
describe('QInputRange', () => {
  afterEach(() => {
    cleanup();
  }); // afterEach
  describe('onChange', () => {
    it('Should $lte/$gte presetOptions "inclusive" ', async () => {
      const expectedFirstCallback = {
        termLabel: 'Greater or Equal to 5',
        termValue: { $gte: '5' },
      };
      const expectedSecondCallback = {
        termLabel: 'Greater or Equal to 5 and Less or Equal to 7',
        termValue: { $gte: '5', $lte: '7' },
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          rangeOption: 'inclusive',
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
        termLabel: 'Greater than 5',
        termValue: { $gt: '5' },
      };
      const expectedSecondCallback = {
        termLabel: 'Greater than 5 and Less than 7',
        termValue: { $gt: '5', $lt: '7' },
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          rangeOption: 'exclusive',
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
        termLabel: 'Greater than 5',
        termValue: '5/',
      };
      const expectedSecondCallback = {
        termLabel: 'Greater than 5 and Less than 7',
        termValue: '5/7',
      };
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({
          onChange: changeHandler,
          rangeOption: 'exclusive',
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
}); // QInputRange
describe('TODO', () => {
  it.skip('Should test "inputDataType"', () => {});
});
//------------------------ Helpers
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
    <QInputRange
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
