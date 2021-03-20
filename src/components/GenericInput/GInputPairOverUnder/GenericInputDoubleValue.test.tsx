import React, { Component } from 'react';
import { render, act, RenderOptions } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { GInputPairOverUnder, GInputPairOverUnderFields } from './GInputPairOverUnder';

const testSubfieldsWithInitialValue = {
  min: { id: 'testLow', label: 'LowerBound', initialValue: 1 },
  max: { id: 'testHigh', label: 'UpperBound', initialValue: 23 },
} as GInputPairOverUnderFields;

describe('QInput', () => {
  describe('Normal Operations', () => {
    it('Should render with no properties, toggle min/max', () => {
      act(() => {
        render(<GInputPairOverUnder />);
      });

      const buttonMin = screen.getByRole('button');
      const textInputMin = screen.getByPlaceholderText('min');
      expect(buttonMin).toBeInTheDocument();
      expect(buttonMin.textContent).toBe('min');
      expect(textInputMin).toBeInTheDocument();

      userEvent.click(screen.getByRole('button'));
      const buttonMax = screen.getByRole('button');
      const textInputMax = screen.getByPlaceholderText('max');
      expect(buttonMax).toBeInTheDocument();
      expect(buttonMax.textContent).toBe('max');
      expect(textInputMax).toBeInTheDocument();

      // and again for coverage
      userEvent.click(screen.getByRole('button'));
      const buttonMin2 = screen.getByRole('button');
      const textInputMin2 = screen.getByPlaceholderText('min');
      expect(buttonMin2).toBeInTheDocument();
      expect(buttonMin2.textContent).toBe('min');
      expect(textInputMin2).toBeInTheDocument();
    });
    it('Should display min/max and call onChange when adding values both min max', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      act(() => {
        render(<GInputPairOverUnder onChange={changeHandler} />);
      });

      await userEvent.type(screen.getByRole('textbox'), '5');
      expect(changeHandler).toHaveBeenCalledWith({ min: '5', max: '' });

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '7');

      expect(changeHandler).toHaveBeenCalledWith({ min: '5', max: '7' });
    });
    it('Should allow config of label, id and initial value, updating display and calling onChange ', async () => {
      // set initial value, displays correct, changes correctly, calls onChange correctly
      const changeHandler = jest.fn((_childChange: any) => {});
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.initialValue = 3;
      tmpSubFields.max.initialValue = 23;
      act(() => {
        render(
          <GInputPairOverUnder onChange={changeHandler} subfields={tmpSubFields} />
        );
      });

      // initialize with min focused,
      // remove existing input, add new - should be reflect in screen and onchange
      await userEvent.type(screen.getByRole('textbox'), '{backspace}5');
      expect(changeHandler).toHaveBeenCalledWith({ testLow: '5', testHigh: 23 });

      // change from min to max, remove existing input, add new - should be reflect in screen and onchange
      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '{backspace}{backspace}7');
      expect(changeHandler).toHaveBeenCalledWith({ testLow: '5', testHigh: '7' });
    });
  });
  describe('Option Helper Text', () => {
    it('Displayed initial value', () => {
      const dom = render(<GInputPairOverUnder />);

      const helperP = dom.container.querySelector('p');
      expect(helperP).not.toBeInTheDocument();
      // expect(helperP?.constructor.name).toBe('HTMLParagraphElement');
      // expect(helperP?.innerHTML).toBe(JSON.stringify({ min: '', max: '' }));
      // expect(screen.getByRole('textbox')).toHaveValue('');
    });
    it('Display string helper text if provided string', () => {
      const dom = render(
        <GInputPairOverUnder helperText="Client supplied helper text" />
      );

      const helperP = dom.container.querySelector('p');
      expect(helperP).toBeInTheDocument();
      // expect(helperP?.constructor.name).toBe('HTMLParagraphElement');
      expect(helperP?.innerHTML).toBe('Client supplied helper text');
      // expect(screen.getByRole('textbox')).toHaveValue('');
    });
    it('Should call a with internal value using default min/max as keys', () => {
      const dom = render(
        <GInputPairOverUnder helperText={(value) => JSON.stringify(value)} />
      );

      const helperP = dom.container.querySelector('p');
      expect(helperP).toBeInTheDocument();
      // expect(helperP?.constructor.name).toBe('HTMLParagraphElement');
      expect(helperP?.innerHTML).toBe('{"min":"","max":""}');
      // expect(screen.getByRole('textbox')).toHaveValue('');
    });
    it('Should call a with internal value using, subfield.id(s) if provided, as keys', () => {
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      delete tmpSubFields.min.initialValue;
      delete tmpSubFields.max.initialValue;
      const dom = render(
        <GInputPairOverUnder
          helperText={(value) => JSON.stringify(value)}
          subfields={tmpSubFields}
        />
      );

      const helperP = dom.container.querySelector('p');
      expect(helperP).toBeInTheDocument();
      expect(helperP?.innerHTML).toBe('{"testLow":"","testHigh":""}');
      // expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  describe('Optional Label Text', () => {
    it('Should contain label and legend when supplied', () => {
      const dom = render(<GInputPairOverUnder label="Client Code Label" />);
      const label = dom.container.querySelector('label');
      expect(label?.innerHTML).toBe('Client Code Label');

      const legend = dom.container.querySelector('legend > span');
      expect(legend?.innerHTML).toMatch('Client Code Label');
    });
    it('Should not contain label or legend when not supplied', () => {
      const dom = render(<GInputPairOverUnder />);
      const label = dom.container.querySelector('label');
      expect(label).toBeNull();

      const legend = dom.container.querySelector('legend > span');
      expect(legend?.innerHTML).toMatch('');
    });
  });

  describe('onChange', () => {
    it('Should be called with default min/max keys', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});

      act(() => {
        render(<GInputPairOverUnder onChange={changeHandler} />);
      });
      await userEvent.type(screen.getByRole('textbox'), '5');

      expect(changeHandler).toHaveBeenCalledWith({ min: '5', max: '' });

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '7');

      expect(changeHandler).toHaveBeenCalledWith({ min: '5', max: '7' });
    });
    it('Should be called with subfield keys when subfield provided', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const tmpSubFields = Object.assign({}, testSubfieldsWithInitialValue);
      tmpSubFields.min.initialValue = '';
      tmpSubFields.max.initialValue = '';

      act(() => {
        render(
          <GInputPairOverUnder onChange={changeHandler} subfields={tmpSubFields} />
        );
      });
      await userEvent.type(screen.getByRole('textbox'), '5');
      expect(changeHandler).toHaveBeenCalledWith({ testLow: '5', testHigh: '' });

      await userEvent.click(screen.getByRole('button'));
      await userEvent.type(screen.getByRole('textbox'), '7');
      expect(changeHandler).toHaveBeenCalledWith({ testLow: '5', testHigh: '7' });
    });
  });
  describe('Error state', () => {
    it.skip('Should have an error state?', () => {});
    it.skip('Parent should be able set/unset', () => {});
  });
});
