import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { GInputPairSideBySide } from './GInputPairSideBySide';
import { DoubleValueFields } from './GInputPairSideBySide.types';

const testSubfields = {
  min: { id: 'testLow', label: 'LowerBound' },
  max: { id: 'testHigh', label: 'UpperBound' },
} as DoubleValueFields;

const testSubfieldsWithInitialValue = {
  min: { id: 'testLow', label: 'LowerBound', intialValue: 1 },
  max: { id: 'testHigh', label: 'UpperBound', intialValue: 23 },
} as DoubleValueFields;

describe('GInputPairSideBySide', () => {
  afterEach(() => {
    cleanup();
  }); // afterEach

  describe('Subfields', () => {
    it('Should be able to set initial values of internal fields', () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.intialValue = 'little';
      tmpSubFields.max.intialValue = 'big';
      act(() => {
        setupRender({ subfields: tmpSubFields });
      });
      const inputBox = screen.getByRole('textbox');
      expect((inputBox as HTMLInputElement).value).toBe('little / big');
    });
    it('Should be able to set labels of internal fields', () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.label = 'Low';
      tmpSubFields.max.label = 'High';

      act(() => {
        setupRender({ subfields: tmpSubFields });
      });

      // button click expands - original text box plus 2 more
      const button = screen.getByRole('button');
      userEvent.click(button);
      const lowEndLabel = screen.getByLabelText('High');
      const highEndLabel = screen.getByLabelText('High');
      expect(lowEndLabel).toBeInTheDocument();
      expect(highEndLabel).toBeInTheDocument();
    });
    it('Should be able to set keys (Id) of internal fields.', async () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      const changeHandler = jest.fn((_childChange: any) => {});

      Object.assign(tmpSubFields.min, { id: 'lowEnd', intialValue: '' });
      Object.assign(tmpSubFields.max, { id: 'highEnd', intialValue: '' });

      act(() => {
        setupRender({ subfields: tmpSubFields, onChange: changeHandler });
      });

      // button click expands - original text box plus 2 more
      const button = screen.getByRole('button');
      userEvent.click(button);
      const inputBoxes = screen.getAllByRole('textbox');

      await userEvent.type(inputBoxes[1], '1');
      await userEvent.type(inputBoxes[2], '99');
      expect(changeHandler).toHaveBeenCalledWith({
        lowEnd: '1',
        highEnd: '99',
      });
    });
  }); //describe('Subfields'
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
    it('Should call helerText function with default fieldIds if supplied', () => {
      act(() => {
        setupRender({ helperText: (value: any) => JSON.stringify(value) });
      });
      const helperP = document.querySelector('p');
      expect(helperP).toBeInTheDocument();
      expect(helperP?.innerHTML).toBe('{"min":"","max":""}');
    });
    it('Should call helerText function with custom Subfield.id(s)', () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      Object.assign(tmpSubFields.min, { id: 'lowEnd', intialValue: '' });
      Object.assign(tmpSubFields.max, { id: 'highEnd', intialValue: '' });

      act(() => {
        setupRender({
          helperText: (value: any) => JSON.stringify(value),
          subfields: tmpSubFields,
        });
      });
      const helperP = document.querySelector('p');
      expect(helperP).toBeInTheDocument();
      expect(helperP?.innerHTML).toBe('{"lowEnd":"","highEnd":""}');
    });
  });
  describe('Label', () => {
    beforeEach(() => {
      cleanup();
    });
    it.skip('Should not be in dom if not set', () => {
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
    it('Should set subfield labels using subfields property', async () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      Object.assign(tmpSubFields.min, {
        id: 'lowEnd',
        intialValue: '',
        label: 'premero',
        inputProps: { 'aria-label': 'premero' },
      });
      Object.assign(tmpSubFields.max, {
        id: 'highEnd',
        intialValue: '',
        label: 'ultima',
        inputProps: { 'aria-label': 'ultima' },
      });

      act(() => {
        setupRender({
          subfields: tmpSubFields,
          label: 'Parent Label',
          inputProps: { 'aria-label': 'Parent Label' },
        });
      });
      const mainLabel = screen.getByLabelText('Parent Label');
      expect(mainLabel).toBeInTheDocument();

      // const mainLabel = document.querySelectorAll('[aria-label="Parent Label"]');
      // expect(mainLabel.length).toBe(1);

      const minLabel = screen.getByLabelText('premero');
      expect(minLabel).toBeInTheDocument();

      const maxLabel = screen.getByLabelText('ultima');
      expect(maxLabel).toBeInTheDocument();
    });
  });
  describe('onChange', () => {
    it('Should be called with default min/max fieldIds if subfields not set', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      act(() => {
        setupRender({ onChange: changeHandler });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith({ min: '5', max: '' });
      expect(changeHandler).toHaveBeenCalledWith({ min: '5', max: '7' });
    });
    it('Should be called with subfield.id when using subfields', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      Object.assign(tmpSubFields.min, { id: 'lowEnd', intialValue: '' });
      Object.assign(tmpSubFields.max, { id: 'highEnd', intialValue: '' });

      act(() => {
        setupRender({ onChange: changeHandler, subfields: tmpSubFields });
      });

      // default isExpanded = false, click isExpanded = true
      userEvent.click(screen.getByRole('button'));
      const textBoxes = screen.getAllByRole('textbox');

      await userEvent.type(textBoxes[1], '5');
      await userEvent.type(textBoxes[2], '7');

      expect(changeHandler).toHaveBeenCalledWith({ lowEnd: '5', highEnd: '' });
      expect(changeHandler).toHaveBeenCalledWith({ lowEnd: '5', highEnd: '7' });
    });
  });
  describe('Format displayed value', () => {
    it('Should default "minValu/maxValue', async () => {
      act(() => {
        setupRender();
      });
      const button = screen.getByRole('button');
      userEvent.click(button);

      const inputBoxes = screen.getAllByRole('textbox');
      expect((inputBoxes[0] as HTMLInputElement).value).toBe(' / ');
    });
    it('Should display custom value format', async () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      Object.assign(tmpSubFields.min, { id: 'lowerBound', intialValue: '' });
      Object.assign(tmpSubFields.max, { id: 'upperBound', intialValue: '' });

      const formatDisplayedValue = (
        lowerBound: string | number,
        upperBound: string | number
      ) => {
        return `between ${lowerBound} and ${upperBound}`;
      };

      act(() => {
        setupRender({
          formatDispayedValues: formatDisplayedValue,
          subfields: tmpSubFields,
        });
      });
      const button = screen.getByRole('button');
      userEvent.click(button);

      const inputBoxes = screen.getAllByRole('textbox');
      userEvent.type(inputBoxes[1], 'smalls');
      userEvent.type(inputBoxes[2], 'bigs');
      expect((inputBoxes[0] as HTMLInputElement).value).toBe('between smalls and bigs');
    });

    it.skip('Should accept customization funtion to format diaplayed value.', () => {});
  });
  describe('Error Messages', () => {
    beforeEach(() => {
      //
    }); // beforeEach
    afterEach(() => {
      cleanup();
    }); // afterEach
    it('Should indicate error in Label', () => {
      const dom = setupBeforeEachError();
      const errorLabel = dom.container.querySelector('label.Mui-error');
      expect(errorLabel).not.toBeNull();
    });
    it('Should *not* indicate error in Label when *not* set', () => {
      const dom = setupBeforeEachError({ errorSubfields: null });
      const errorLabel = dom.container.querySelector('label.Mui-error');
      expect(errorLabel).toBeNull();
    });

    it('Should include helper text when *not* expanded. Will hide when expanded ', () => {
      act(() => {
        setupBeforeEachError();
      });
      //Mui-error
      const expandButton = screen.getByRole('button');

      let minError = screen.getByText(/premero:\s*Low End Error/g);
      let maxError = screen.getByText(/ultima:\s*High End Error/g);
      expect(minError).toBeInTheDocument();
      expect(maxError).toBeInTheDocument();

      let helperP = document.querySelector('p.Mui-error');
      expect(helperP).toBeInTheDocument();

      userEvent.click(expandButton);

      helperP = document.querySelector('p.Mui-error');
      expect(helperP).toBeNull();
    }); //it('Should indicate error when set'
    it('Should display error state if only one subfield is in error state ', () => {
      const errorSubfields = { min: 'Low End Error' };
      act(() => {
        setupRender({ errorSubfields: errorSubfields });
      });
      //Mui-error
      const expandButton = screen.getByRole('button');

      let minError = screen.getByText(/min:\s*Low End Error/g);
      expect(minError).toBeInTheDocument();

      let helperP = document.querySelector('p.Mui-error');
      expect(helperP).toBeInTheDocument();

      userEvent.click(expandButton);

      helperP = document.querySelector('p.Mui-error');
      expect(helperP).toBeNull();
    }); //it('Should indicate error when set'
  }); //describe('Error Messages',
  describe('misc', () => {
    it.skip('should apply or not required ', () => {});
    test.skip('Click away should work', async () => {
      act(() => {
        render(
          <div>
            <div id="clickAwayArea" style={{ width: '200px', height: '200px' }}>
              Click Away Area
              <button id="clickAwayButton">Click Away Button</button>
            </div>
            <GInputPairSideBySide id="clickAwayTestComponent" />
          </div>
        );
      });
      const clickAwayArea = document.querySelector('#clickAwayArea');
      const buttons = screen.getAllByRole('button');

      let textboxes = screen.getAllByRole('textbox');
      expect(textboxes.length).toBe(1);

      userEvent.click(buttons[1]);
      textboxes = screen.getAllByRole('textbox');
      expect(textboxes.length).toBe(3);
      // I think there maybe a timing issue.
      // also clickAway doesn't seems to work good, not perfect.
      await userEvent.click(buttons[1]);
      textboxes = screen.getAllByRole('textbox');
      expect(textboxes.length).toBe(1);
    });
  });
  describe('Smoke Tests', () => {
    let buttons;
    beforeEach(() => {
      act(() => {
        render(<GInputPairSideBySide />);
        buttons = screen.getAllByRole('button');
      });
    });
    afterEach(() => {
      cleanup();
    });
    test('Initial State only one text box', () => {
      let inputBoxes = screen.getAllByRole('textbox');
      expect(inputBoxes.length).toBe(1);
      expect((inputBoxes[0] as HTMLInputElement).value).toBe(' / ');
    });
    test('Should have only one button', () => {
      // const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(1);
    });
    test('Click button (expand) will display 2 more text boxes (min/max)', () => {
      const buttons = screen.getAllByRole('button');

      // button click expands - original text box plus 2 more
      userEvent.click(buttons[0]);
      const inputBoxes = screen.getAllByRole('textbox');
      expect(inputBoxes.length).toBe(3);
    });
    test.skip('Expand property added. Need to use it for tests?', () => {});
    test('Primary text input does not accept input', async () => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(1);

      // button click expands - original text box plus 2 more
      userEvent.click(buttons[0]);
      const inputBoxes = screen.getAllByRole('textbox');
      expect(inputBoxes.length).toBe(3);

      // original text box does not accept user input
      await userEvent.type(inputBoxes[0], 'any thing');
      expect((inputBoxes[0] as HTMLInputElement).value).toBe(' / ');
    });
    test('Input into min/max fields changes display in primar textbox', async () => {
      const buttons = screen.getAllByRole('button');

      // button click expands - original text box plus 2 more
      userEvent.click(buttons[0]);
      const inputBoxes = screen.getAllByRole('textbox');

      // children0 accepts first postion text
      await userEvent.type(inputBoxes[1], 'first');
      expect((inputBoxes[1] as HTMLInputElement).value).toBe('first');
      expect((inputBoxes[0] as HTMLInputElement).value).toBe('first / ');

      // children1 accepts first postion text
      await userEvent.type(inputBoxes[2], 'second');
      expect((inputBoxes[2] as HTMLInputElement).value).toBe('second');
      expect((inputBoxes[0] as HTMLInputElement).value).toBe('first / second');
    });
    test('Button click again un-expand (back to 1 textbox', () => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(1);

      userEvent.click(buttons[0]);
      let inputBoxes = screen.getAllByRole('textbox');
      expect(inputBoxes.length).toBe(3);

      userEvent.click(buttons[0]);
      inputBoxes = screen.getAllByRole('textbox');
      expect(buttons.length).toBe(1);
    });
  }); //describe('Smoke test...
}); // describe('GOverUnder'

// ------------------  Helpers

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
    <GInputPairSideBySide {...effectiveProps} id={'testManyThings' + Math.random()} />
  );
};

const setupBeforeEachError = (focusProps: PropertyObject = {}) => {
  const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
  const changeHandler = jest.fn((_childChange: any) => {});
  const formatDisplayedValue = (
    lowerBound: string | number,
    upperBound: string | number
  ) => {
    return `between ${lowerBound} and ${upperBound}`;
  };

  const effectiveProps = {
    ...{
      errorSubfields: { lowerBound: 'Low End Error', upperBound: 'High End Error' },
    },
    ...focusProps,
  } as PropertyObject;
  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });

  tmpSubFields.min.id = 'lowerBound';
  tmpSubFields.max.id = 'upperBound';

  tmpSubFields.min.label = 'premero';
  tmpSubFields.max.label = 'ultima';

  tmpSubFields.min.intialValue = '';
  tmpSubFields.max.intialValue = '';

  return render(
    <GInputPairSideBySide
      onChange={changeHandler}
      {...effectiveProps}
      //errorSubfields={{ lowerBound: 'Low End Error', upperBound: 'High End Error' }}
      subfields={tmpSubFields}
      formatDispayedValues={formatDisplayedValue}
      helperText="The Helper Text"
      id={'testManyThings' + Math.random()}
      label="Parent Label"
    />
  );
};
