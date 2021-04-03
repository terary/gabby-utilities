import React from 'react';
import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { QueryTermBuilder } from './QueryTermBuilder';
import { AllOperators } from './index';
import { dbFields, operatorLabels } from './test-helpers';
import { TermOperatorLabelCollection, defaultOperatorLabels } from './types';

/**
 * Named QueryTermBuilderT (T) for test run purposes
 * TODO - rename to QueryTermBuilderT (no T) after done writing tests
 */

describe('QueryTermBuilder', () => {
  describe('Properties', () => {
    describe('operatorsWithLabels', () => {
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
    describe('Expression and UI - Symmetry', () => {
      it('Should accept and display QueryExpression same as QueryExpression created ($oneOf)', () => {
        const expected = Object.assign(
          {},
          // incase dbFields doesn't have the options will cause failure
          { label: 'MISSING', value: 'MISSING' },
          dbFields['customers.favoriteFruit'].selectOptions?.[1]
        );
        const initialQueryExpression = {
          dataType: 'text',
          nodeId: 'test-display-existing-expression',
          subjectId: 'customers.favoriteFruit',
          operator: '$oneOf',
          value: 'apples0002', // not sure if null is a better option/
        };

        act(() => {
          setupRender({
            initialQueryExpression,
            querySubjects: dbFields,
          });
        });

        const buttons = screen.getAllByRole('button');
        const selectBoxes = screen.getAllByRole('combobox');
        const hiddenInputs = document.querySelectorAll('input[aria-hidden="true"]');

        expect(selectBoxes.length).toBe(2);
        expect(buttons.length).toBe(1);
        expect(hiddenInputs.length).toBe(1);

        expect(screen.getByText(expected.label)).toBeInTheDocument();
        expect(screen.getByText('Red Apple')).toBeInTheDocument();

        //values
        // that they are the same and not empty
        expect((hiddenInputs[0] as HTMLInputElement).value).toBe(expected.value);
        expect((hiddenInputs[0] as HTMLInputElement).value).toBe('apples0002');

        expect((selectBoxes[0] as HTMLInputElement).value).toBe(
          initialQueryExpression.subjectId
        );
        expect((selectBoxes[1] as HTMLInputElement).value).toBe(
          initialQueryExpression.operator
        );
      });
      it('Should accept and display QueryExpression same as QueryExpression created ($anyOf)', () => {
        const expectedValues = [
          // dropdown values
          dbFields['customers.daysOff'].selectOptions?.[2].value,
          dbFields['customers.daysOff'].selectOptions?.[4].value,
        ];
        const expectedLabels = [
          // dropdown labels
          dbFields['customers.daysOff'].selectOptions?.[2].label,
          dbFields['customers.daysOff'].selectOptions?.[4].label,
        ];
        const initialQueryExpression = {
          dataType: 'text',
          nodeId: 'test-display-existing-expression',
          subjectId: 'customers.daysOff',
          operator: '$anyOf',
          value: ['wednesday', 'friday'], // not sure if null is a better option/
        };

        act(() => {
          setupRender({
            initialQueryExpression,
            querySubjects: dbFields,
          });
        });

        const buttons = screen.getAllByRole('button');
        const selectBoxes = screen.getAllByRole('combobox');
        const hiddenInputs = document.querySelectorAll('input[aria-hidden="true"]');

        expect(selectBoxes.length).toBe(2);
        expect(buttons.length).toBe(1);
        expect(hiddenInputs.length).toBe(1);

        //presentation
        expect(screen.getByText(expectedLabels.join(', '))).toBeInTheDocument();
        expect(screen.getByText('Wednesday, Friday')).toBeInTheDocument();

        //values
        expect((selectBoxes[0] as HTMLInputElement).value).toBe(
          initialQueryExpression.subjectId
        );
        expect((selectBoxes[1] as HTMLInputElement).value).toBe(
          initialQueryExpression.operator
        );

        expect((hiddenInputs[0] as HTMLInputElement).value).toBe(
          expectedValues.join(',')
        );
        expect((hiddenInputs[0] as HTMLInputElement).value).toBe('wednesday,friday');
      });

      it('Should accept and display QueryExpression same as QueryExpression created ($betweenX)', () => {
        const initialQueryExpression = {
          dataType: 'decimal',
          nodeId: 'nodePredefined004',
          subjectId: 'customers.annualSalary',
          operator: '$betweenX',
          value: { $gt: 3, $lt: 3000 },
        };

        act(() => {
          setupRender({
            initialQueryExpression,
            querySubjects: dbFields,
          });
        });

        const buttons = screen.getAllByRole('button');
        const selectBoxes = screen.getAllByRole('combobox');
        const numberInputs = document.querySelectorAll('input[type="number"]');

        // layout
        expect(selectBoxes.length).toBe(2);
        expect(buttons.length).toBe(1);
        expect(numberInputs.length).toBe(2);

        // values
        expect((selectBoxes[0] as HTMLInputElement).value).toBe(
          initialQueryExpression.subjectId
        );
        expect((selectBoxes[1] as HTMLInputElement).value).toBe(
          initialQueryExpression.operator
        );
        expect((numberInputs[0] as HTMLInputElement).value).toBe(
          initialQueryExpression.value['$gt'] + '' // I think because htmlElement will be string
        );
        expect((numberInputs[1] as HTMLInputElement).value).toBe(
          initialQueryExpression.value['$lt'] + '' // I think because htmlElement will be string
        );
      });
      it('Should accept and display QueryExpression same as QueryExpression created ($betweenI)', () => {
        const initialQueryExpression = {
          dataType: 'decimal',
          nodeId: 'nodePredefined004',
          subjectId: 'customers.annualSalary',
          operator: '$betweenI',
          value: { $gte: 3, $lte: 3000 },
        };

        act(() => {
          setupRender({
            initialQueryExpression,
            querySubjects: dbFields,
          });
        });

        const buttons = screen.getAllByRole('button');
        const selectBoxes = screen.getAllByRole('combobox');
        const numberInputs = document.querySelectorAll('input[type="number"]');

        // layout
        expect(selectBoxes.length).toBe(2);
        expect(buttons.length).toBe(1);
        expect(numberInputs.length).toBe(2);

        // values
        expect((selectBoxes[0] as HTMLInputElement).value).toBe(
          initialQueryExpression.subjectId
        );
        expect((selectBoxes[1] as HTMLInputElement).value).toBe(
          initialQueryExpression.operator
        );
        expect((numberInputs[0] as HTMLInputElement).value).toBe(
          initialQueryExpression.value['$gte'] + '' // I think because htmlElement will be string
        );
        expect((numberInputs[1] as HTMLInputElement).value).toBe(
          initialQueryExpression.value['$lte'] + '' // I think because htmlElement will be string
        );
      });
      ['$eq', '$gt', '$gte', '$lt', '$lte', '$regex'].forEach((operator) => {
        it(`Should accept and display QueryExpression same as QueryExpression created (${operator})`, () => {
          const initialQueryExpression = {
            dataType: 'text',
            nodeId: 'nodePredefined004',
            subjectId: 'customers.lastName',
            operator: operator,
            value: 'test data to be displayed',
          };

          act(() => {
            setupRender({
              initialQueryExpression,
              querySubjects: dbFields,
            });
          });

          const selectBoxes = screen.getAllByRole('combobox');
          const textInputs = document.querySelectorAll('input[type="text"]');

          // layout
          expect(selectBoxes.length).toBe(2);
          expect(textInputs.length).toBe(1);

          // values
          expect((selectBoxes[0] as HTMLInputElement).value).toBe(
            initialQueryExpression.subjectId
          );
          expect((selectBoxes[1] as HTMLInputElement).value).toBe(
            operator
            // initialQueryExpression.operator
          );
          expect((textInputs[0] as HTMLInputElement).value).toBe(
            initialQueryExpression.value
          );
        });
      }); // foreach Operator
    });
    describe('onExpressionChange', () => {
      it('Should be sane', async () => {
        const changeHandler = jest.fn((_childChange: any) => {});
        // make this into a helper function - beat the hell out of this test
        // want to change opLabels then change tests accordingly
        const expectedCallback = [
          [
            {
              dataType: 'text',
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
  }); // describe properties
  describe.skip('Behavior', () => {
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
