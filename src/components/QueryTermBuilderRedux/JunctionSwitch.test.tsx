import React from 'react';

import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { JunctionSwitch } from './JunctionSwitch';



describe('JunctionSwitch', () => {
  afterEach(() => {
    cleanup();
  });
  it('Should set label to "All of" for $and', () => {
    act(() => {
      setupRender({
        junctionOperator: '$and',
      });
    });
    expect(screen.getByText('All of')).toBeInTheDocument();
  });
  it('Should set label to "Any of" for $or', () => {
    act(() => {
      setupRender({
        junctionOperator: '$or',
      });
    });
    expect(screen.getByText('Any of')).toBeInTheDocument();
  });
  describe('Labelling', () => {
    it('Should accept/use supplied labels ($and)',  async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const expectedCallback = [['$and']];
      act(() => {
        setupRender({
          junctionLabels: { $and: 'AND', $or: 'OR' },
          junctionOperator: '$and',
          onChange: changeHandler,
        });
      });
      expect(screen.getByText('AND')).toBeInTheDocument();
      const theSwitch = screen.getByRole('checkbox');
      await userEvent.click(theSwitch);
      expect(changeHandler).toHaveBeenCalledTimes(expectedCallback.length);
    });
    it('Should accept/use supplied labels ($or)', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const expectedCallback = [['$or']];
      act(() => {
        setupRender({
          junctionLabels: { $and: 'AND', $or: 'OR' },
          junctionOperator: '$or',
          onChange: changeHandler,
        });
      });
      expect(screen.getByText('OR')).toBeInTheDocument();
      const theSwitch = screen.getByRole('checkbox');
      await userEvent.click(theSwitch);
      expect(changeHandler).toHaveBeenCalledTimes(expectedCallback.length);
    });
  });
  describe('onChange', () => {
    it('Should call cb with current state ($and)', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const expectedCallback = [['$and']];
      act(() => {
        setupRender({
          junctionOperator: '$and',
          onChange: changeHandler,
        });
      });
      expect(screen.getByText('All of')).toBeInTheDocument();

      const checkBoxes = screen.getAllByRole('checkbox');
      expect(checkBoxes.length).toBe(1);
      await userEvent.click(checkBoxes[0]);
      expect(changeHandler).toHaveBeenCalledTimes(expectedCallback.length);
    });
    it('Should call cb with current state ($or)', async () => {
      const changeHandler = jest.fn((_childChange: any) => {});
      const expectedCallback = [['$or']];
      act(() => {
        setupRender({
          junctionOperator: '$or',
          onChange: changeHandler,
        });
      });
      expect(screen.getByText('Any of')).toBeInTheDocument();
      const checkBoxes = screen.getAllByRole('checkbox');
      expect(checkBoxes.length).toBe(1);
      await userEvent.click(checkBoxes[0]);
      expect(changeHandler).toHaveBeenCalledTimes(expectedCallback.length);
    });
  });
});
// --------------------------- Helpers
type PropertyObject = { [propName: string]: any };

const setupRender = (focusProps: PropertyObject = {}) => {
  const defaultProps = {
    // queryExpression: makeTestQueryExpression(),
    // nodeId: 'Node ID Not Set',
    // operatorsWithLabels: operatorLabels,
    // onExpressionChange: (...arg: any) => {},
    // querySubjects: dbFields,
    // querySubjects: dbFields,
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
  return render(<JunctionSwitch {...effectiveProps} />);
};
