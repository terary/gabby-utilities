import React from 'react';
import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { QueryTermBuilder } from './QueryTermBuilder';
import { AllOperators } from './index';
import { dbFields, operatorLabels } from './test-helpers';
import {
  QueryTermExpression,
  QueryTermValue,
  TermOperatorLabelCollection,
  TermSubjectCollection,
  TermSubject,
  defaultOperatorLabels,
} from './types';

/**
 * Named QueryTermBuilderT (T) for test run purposes
 * TODO - rename to QueryTermBuilderT (no T) after done writing tests
 */

describe('QueryTermBuilder', () => {
  describe('Properties', () => {
    describe('nodeId', () => {
      it('Should be', () => {});
    }); //  describe('nodeId'
    describe('operatorsWithLabels', () => {
      it.skip('Should be dynamic, change language, change short/long form (mobile)', () => {});
      it('Will use default labels if not provided', () => {
        const subjects = {
          opLabelTest: {
            id: 'opLabelTest',
            label: 'Op Label Test',
            dataType: 'text',
            queryOps: Object.keys(AllOperators),
          },
        };
        act(() => {
          setupRender({
            operatorsWithLabels: null,
            querySubjects: subjects,
          });
        });

        Object.entries(defaultOperatorLabels).forEach(([op, labelPair]) => {
          const expectedLabel = labelPair.long;
          expect(screen.getByText(expectedLabel)).toBeInTheDocument();
        });
      });
      it('Used to label operator', () => {
        const subjects = {
          opLabelTest: {
            id: 'opLabelTest',
            label: 'Op Label Test',
            dataType: 'text',
            queryOps: Object.keys(AllOperators),
          },
        };
        act(() => {
          setupRender({
            operatorsWithLabels: testOperatorLabels,
            querySubjects: subjects,
          });
        });

        Object.entries(testOperatorLabels).forEach(([op, labelPair]) => {
          const expectedLabel = labelPair.long;
          expect(screen.getByText(expectedLabel)).toBeInTheDocument();
        });
      });
    }); // describe('operatorsWithLabels
    describe.only('onExpressionChange', () => {
      it('Should be', () => {});
      it('Should be sane', async () => {
        const changeHandler = jest.fn((_childChange: any) => {});
        make this into a helper function - beat the hell out of this test
        want to change opLabels then change tests accordingly
        const expectedCallback = [
          [
            {
              dataType: 'text',
              label: 'Test Subject Is 5',
              mongoExpression: {
                testSubject: {
                  $eq: '5',
                },
              },
              nodeId: 'Node ID Not Set',
              operator: '$eq',
              subjectId: 'testSubject',
              value: '5',
            },
          ],
        ];

        const querySubjects = {
          testSubject: {
            id: 'testSubject',
            label: 'Test Subject',
            dataType: 'text',
            queryOps: ['$eq'],
          },
        };

        act(() => {
          setupRender({
            querySubjects: querySubjects,
            onExpressionChange: changeHandler,
          });
        });
        const textBoxes = screen.getAllByRole('textbox');
        const selectBoxes = screen.getAllByRole('combobox');
        expect(textBoxes.length).toBe(1);
        expect(selectBoxes.length).toBe(2);

        await userEvent.type(textBoxes[0], '5');

        expect(changeHandler.mock.calls).toEqual(expectedCallback);
        expect(changeHandler).toHaveBeenCalledTimes(expectedCallback.length);
      });
    }); // describe('onExpressionChange'
    describe('querySubjects', () => {
      it('Will shit the bed without this property', () => {});
      it('Should be - sanity', () => {
        act(() => {
          setupRender({
            querySubjects: dbFields,
          });
        });
        const textBoxes = screen.getAllByRole('textbox');
        const selectBoxes = screen.getAllByRole('combobox');
        expect(textBoxes.length).toBe(1);
        expect(selectBoxes.length).toBe(2);
      });
      it('Used to determine what fields can be queried', () => {
        act(() => {
          const querySubjects = {
            'customers.firstName': {
              id: 'customers.firstName',
              label: 'First Name',
              dataType: 'text',
              queryOps: ['$eq'],
            },
            'customers.lastName': {
              id: 'customers.lastName',
              label: 'Last Name',
              dataType: 'text',
              queryOps: [
                '$eq',
                '$lt',
                '$lte',
                '$gt',
                '$gte',
                '$regex',
                '$betweenX',
                '$betweenI',
              ],
            },
          };
          setupRender({
            querySubjects: querySubjects,
          });
          const textBoxes = screen.getAllByRole('textbox');
          const selectBoxes = screen.getAllByRole('combobox');
          expect(textBoxes.length).toBe(1);
          expect(selectBoxes.length).toBe(2);
          expect(selectBoxes[0].children.length).toBe(
            Object.keys(querySubjects).length
          );
        });
      });
      it('Used to determine what operators are available for field', async () => {
        const querySubjects = {
          'customers.firstName': {
            id: 'customers.firstName',
            label: 'First Name',
            dataType: 'text',
            queryOps: ['$eq'],
          },
          'customers.lastName': {
            id: 'customers.lastName',
            label: 'Last Name',
            dataType: 'text',
            queryOps: [
              '$eq',
              '$lt',
              '$lte',
              '$gt',
              '$gte',
              '$regex',
              '$betweenX',
              '$betweenI',
            ],
          },
        };

        act(() => {
          setupRender({
            querySubjects: querySubjects,
          });
        });
        const textBoxes = screen.getAllByRole('textbox');
        const selectBoxes = screen.getAllByRole('combobox');
        expect(textBoxes.length).toBe(1);
        expect(selectBoxes.length).toBe(2);

        // precondition
        expect(selectBoxes[1].children.length).toBe(
          Object.keys(querySubjects['customers.firstName']['queryOps']).length
        );

        fireEvent.change(selectBoxes[0], { target: { value: 'customers.lastName' } });
        const selectBoxesPostChange = screen.getAllByRole('combobox');

        //post condition
        expect(selectBoxesPostChange[1].children.length).toBe(
          Object.keys(querySubjects['customers.lastName']['queryOps']).length
        );
      });
    }); // describe('querySubjects'

    // operatorsWithLabels: TermOperatorLabelCollection;
    // onExpressionChange: (expression: QueryTermExpression | null) => void;
    // querySubjects: TermSubjectCollection;
  }); // describe properties
  describe('Behavior', () => {
    describe('Subject Selector Change', () => {
      it('Should change available operators', () => {});
      it('Should change available operators -covered in properties/querySubjects', () => {});
      it('Should *not* (or should?) change empty value field', () => {});
      it('Should *not* (or should?) call back?', () => {});
    }); // describe behavior/subject change;
    describe('Operator Selector Change', () => {
      it('Should *not* (or should?) change empty value field', () => {});
      it('Should *not* (or should?) call back?', () => {});
    }); // describe behavior/operator change;
  }); // describe(behavior);
}); // describe QueryTermBuilder

// --------------------------- Helpers
type PropertyObject = { [propName: string]: any };

const setupRender = (focusProps: PropertyObject = {}) => {
  const defaultProps = {
    // queryExpression: makeTestQueryExpression(),
    nodeId: 'Node ID Not Set',
    operatorsWithLabels: operatorLabels,
    onExpressionChange: (...arg: any) => {},
    querySubjects: dbFields,
    // querySubjects: dbFields,
  };

  const effectiveProps = {
    ...defaultProps,
    ...focusProps,
  } as PropertyObject;

  // if (!effectiveProps.queryExpression) {
  //   effectiveProps.queryExpression = makeTestQueryExpression(
  //     effectiveProps.dataType || 'text',
  //     effectiveProps.nodeId || 'nodeIdTest001',
  //     effectiveProps.subjectId || 'testField.subjectId',
  //     effectiveProps.queryOperator || '$eq'
  //   );
  // }

  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });

  //@ts-ignore
  return render(<QueryTermBuilder {...effectiveProps} />);
};

export const testOperatorLabels = {
  $eq: {
    long: 'Testing - Is',
    short: '=',
  },
  $lt: {
    long: 'Testing - Less Than',
    short: '<',
  },
  $gt: {
    long: 'Testing - Greater Than',
    short: '>',
  },
  $lte: {
    long: 'Testing - Less or Equal',
    short: '=<',
  },
  $gte: {
    long: 'Testing - Greater or Equal',
    short: '>=',
  },
  $regex: {
    long: 'Testing - Contains',
    short: 'has',
  },
  $anyOf: {
    long: 'Testing - Any Of',
    short: 'in',
  },
  $oneOf: {
    long: 'Testing - One Of',
    short: 'is',
  },
  $betweenX: {
    long: 'Testing - Between',
    short: 'between',
  },
  $betweenI: {
    long: 'Testing - BetweenI',
    short: 'between',
  },
} as TermOperatorLabelCollection;
