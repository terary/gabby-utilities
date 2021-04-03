import React, { useState } from 'react';
import { render, act, cleanup, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { InputMux } from './InputMux';
import { dbFields, validQueryOperators } from './test-helpers';
import { QueryTermExpression } from './types';

describe('InputMux', () => {
  afterEach(() => {
    cleanup();
  });
  describe('Properties', () => {
    describe('label', () => {
      validQueryOperators.forEach((op) => {
        // vscode doesn't seem to like the loop but command line is ok
        const randomNumber = Math.random();

        it(`${op} Should have label, random value ${randomNumber}`, () => {
          act(() => {
            setupRender({
              label: 'This is a Label' + randomNumber,
            });
          });
          const labels = document.querySelectorAll('label');
          const legends = document.querySelectorAll('legend');
          expect(labels.length).toBe(1);
          expect(labels[0].innerHTML).toBe('This is a Label' + randomNumber);
          expect(legends.length).toBe(1);
          expect(legends[0].innerHTML).toBe(
            `<span>This is a Label${randomNumber}</span>`
          );
        }); // it('should have one')
      }); /// foreach
    }); // describe(label)

    describe('queryExpression', () => {});
    describe('onChange', () => {
      it(`..Should be called with value honoring datatype integer ($eq) `, async () => {
        let theValue = null;
        const changeHandler = jest.fn((_childChange: any) => {
          theValue = _childChange;
        });

        const expectCallbackHelper = (value: string | number) => {
          return [value];
        };

        const expectedCallbacks = [
          expectCallbackHelper(5),
          expectCallbackHelper(51),
          expectCallbackHelper(5),
          [null],
        ];
        act(() => {
          setupStatefulRender({
            onChange: changeHandler,
            queryExpression: {
              operator: '$eq',
              dataType: 'integer',
              value: '',
            },
          });
        });
        const numberBoxes = screen.getAllByRole('spinbutton');
        await userEvent.type(numberBoxes[0], '51');
        await userEvent.type(numberBoxes[0], '{backspace}{backspace}');

        expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
        expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
      });

      ['$eq', '$gt', '$gte', '$lt', '$lte'].forEach((operator) => {
        describe(`${operator}`, () => {
          it(`Should be called with value honoring datatype integer (${operator}) `, async () => {
            const changeHandler = jest.fn((_childChange: any) => {});

            const expectCallbackHelper = (value: string | number) => {
              return [value];
            };
            const expectedCallbacks = [
              expectCallbackHelper(5),
              expectCallbackHelper(51),
              expectCallbackHelper(5),
              [null],
            ];
            act(() => {
              setupStatefulRender({
                onChange: changeHandler,
                queryExpression: {
                  operator,
                  dataType: 'integer',
                },
              });
            });
            const numberBoxes = screen.getAllByRole('spinbutton');
            await userEvent.type(numberBoxes[0], '51');
            await userEvent.type(numberBoxes[0], '{backspace}{backspace}');

            expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
            expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
          });
          it(`Should be called with { label, value, mongoValue: { ${operator}: value } honoring datatype decimal (${operator}) `, async () => {
            const changeHandler = jest.fn((_childChange: any) => {});

            const expectCallbackHelper = (value: string | number) => {
              return [value];
            };
            const expectedCallbacks = [
              expectCallbackHelper(5),
              expectCallbackHelper(51),
              // decimal does funky things
              [null], //expectCallbackHelper(51, '51'),
              expectCallbackHelper(51.1),
              expectCallbackHelper(51.12),

              expectCallbackHelper(51.1),
              [null],
              // expectCallbackHelper(51, '51'),
              //
              // actual use seems to work as expected.  Testing library seems goofed
              // https://github.com/testing-library/user-event/issues/360
              //  mock typing '.' after number (5.) - is consider invalid input and doesn't fire event.
              // This test works if expected value (5.0123) 5123, which is an error.
            ];
            act(() => {
              setupStatefulRender({
                onChange: changeHandler,
                queryExpression: {
                  operator,
                  dataType: 'decimal',
                },
              });
            });
            const numberBoxes = screen.getAllByRole('spinbutton');
            await userEvent.type(numberBoxes[0], '51.12');
            //                                         2         1          .
            await userEvent.type(numberBoxes[0], '{backspace}{backspace}{backspace}');

            expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
            expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
          });
          it(`Should be called with value honoring datatype text (${operator}) `, async () => {
            const changeHandler = jest.fn((_childChange: any) => {});

            const expectCallbackHelper = (value: string | number) => {
              return [value];
            };
            const expectedCallbacks = [
              expectCallbackHelper('5'),
              expectCallbackHelper('51'),
            ];
            act(() => {
              setupStatefulRender({
                onChange: changeHandler,
                dataType: 'text',
                queryExpression: {
                  operator,
                },
              });
            });
            const numberBoxes = screen.getAllByRole('textbox');
            await userEvent.type(numberBoxes[0], '51');

            expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
            expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
          });
          it.skip(`Should be called with { label, value, mongoValue: { ${operator}: value }  (${operator})  - date needs work`, async () => {
            const changeHandler = jest.fn((_childChange: any) => {});

            const expectCallbackHelper = (value: string | number, label: string) => {
              return [{ label, value: value + '', mongoValue: { $eq: value + '' } }];
              // return [{ termLabel: label, termValue: { $eq: value + '' } }];
            };
            const expectedCallbacks = [
              expectCallbackHelper(5, '5'),
              expectCallbackHelper(51, '51'),
            ];
            act(() => {
              setupRender({
                onChange: changeHandler,
                dataType: 'date',
                queryExpression: {
                  operator,
                },
              });
            });
            // date implementation has yet to be determined.
            // formal requirements are expected sometime in the future.
            // currently, rely on browser native support.

            expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
            expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
          });
        }); // describe op
      });
      describe('initialValue', () => {
        it('Should be able to set it', () => {});
      });
      describe('$betweenX', () => {
        it(`betweenX: Should call with single or double value when appropriate {$gt,$lt}`, async () => {
          const changeHandler = jest.fn((_childChange: any) => {});
          const expectedCallbacks = [
            expectOnChangeBetweenExclusive('5', undefined),
            expectOnChangeBetweenExclusive('51', undefined),
            expectOnChangeBetweenExclusive('51', '7'),
            expectOnChangeBetweenExclusive('51', '72'),
            expectOnChangeBetweenExclusive('5', '72'),
            expectOnChangeBetweenExclusive(undefined, '72'),
            expectOnChangeBetweenExclusive(undefined, '7'),
            [null],
          ];
          act(() => {
            setupRender({
              onChange: changeHandler,
              dataType: 'integer',
              queryExpression: {
                operator: '$betweenX',
              },
            });
          });
          userEvent.click(screen.getByRole('button'));
          const textBoxes = screen.getAllByRole('textbox');

          // await userEvent.type(textBoxes[1], '5');
          await userEvent.type(textBoxes[1], '51');
          await userEvent.type(textBoxes[2], '72');
          await userEvent.type(textBoxes[1], '{backspace}{backspace}');
          await userEvent.type(textBoxes[2], '{backspace}{backspace}');

          // await userEvent.type(textBoxes[2], '7');
          expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
          expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
        }); // it(betweenX)
      }); // describe('$betweenX'
      describe('$betweenI', () => {
        it(`betweenI: Should call with single or double value when appropriate {$gte,$lte}`, async () => {
          const changeHandler = jest.fn((_childChange: any) => {});
          const expectedCallbacks = [
            expectOnChangeBetweenInclusive('5', undefined),
            expectOnChangeBetweenInclusive('51', undefined),
            expectOnChangeBetweenInclusive('51', '7'),
            expectOnChangeBetweenInclusive('51', '72'),
            expectOnChangeBetweenInclusive('5', '72'),
            expectOnChangeBetweenInclusive(undefined, '72'),
            expectOnChangeBetweenInclusive(undefined, '7'),
            [null],
            // expectCallbackHelper(51, '51'),
          ];
          act(() => {
            setupRender({
              onChange: changeHandler,
              dataType: 'integer',
              queryExpression: {
                operator: '$betweenI',
              },
            });
          });
          userEvent.click(screen.getByRole('button'));
          const textBoxes = screen.getAllByRole('textbox');

          await userEvent.type(textBoxes[1], '51');
          await userEvent.type(textBoxes[2], '72');
          await userEvent.type(textBoxes[1], '{backspace}{backspace}');
          await userEvent.type(textBoxes[2], '{backspace}{backspace}');

          // await userEvent.type(textBoxes[2], '7');

          expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
          expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
        });
      });
      describe('$anyOf (multi-select)', () => {
        it(`Should be called with [values] honoring datatype text ($anyOf) `, async () => {
          const changeHandler = jest.fn((_childChange: any) => {});

          const expectCallbackHelper = (value: (string | number)[]) => {
            return [value];
          };
          const expectedCallbacks = [
            expectCallbackHelper([1]),
            expectCallbackHelper([1, 2]),
            expectCallbackHelper([1, 2, 'Some String']),
          ];

          const testOptions = [
            { value: 1, label: 'Integer' },
            { value: 2, label: 'String Number' },
            { value: 3.14, label: 'Decimal' },
            { value: 'date', label: 'Date' },
            { value: 'Some String', label: 'Some String' },
          ];
          act(() => {
            setupRender({
              onChange: changeHandler,
              selectOptions: testOptions,
              queryExpression: {
                operator: '$anyOf',
              },
            });
          });
          fireEvent.mouseDown(screen.getByRole('button'));
          const listbox = within(screen.getByRole('listbox'));

          fireEvent.click(listbox.getByText(/Integer/i));
          fireEvent.click(listbox.getByText(/String Number/i));
          fireEvent.click(listbox.getByText(/Some String/i));

          expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
          expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
        });
      });
      describe('$oneOf', () => {
        it(`Should be called with value  honoring datatype text ($oneOf) `, async () => {
          const changeHandler = jest.fn((_childChange: any) => {});

          const expectCallbackHelper = (value: string | number) => {
            return [value];
          };
          const expectedCallbacks = [
            expectCallbackHelper(1),
            expectCallbackHelper('2'),
            expectCallbackHelper('Some String'),
          ];

          const testOptions = [
            { value: 1, label: 'Integer' },
            { value: '2', label: 'String Number' },
            { value: 3.14, label: 'Decimal' },
            { value: 'date', label: 'Date' },
            { value: 'Some String', label: 'Some String' },
          ];
          act(() => {
            setupRender({
              onChange: changeHandler,
              selectOptions: testOptions,
              queryExpression: {
                operator: '$oneOf',
              },
            });
          });
          fireEvent.mouseDown(screen.getByRole('button'));
          const listbox = within(screen.getByRole('listbox'));

          fireEvent.click(listbox.getByText(/Integer/i));
          fireEvent.click(listbox.getByText(/String Number/i));
          fireEvent.click(listbox.getByText(/Some String/i));

          expect(changeHandler.mock.calls).toEqual(expectedCallbacks);
          expect(changeHandler).toHaveBeenCalledTimes(expectedCallbacks.length);
        });
      });
    });
    describe('selectItems', () => {
      const testSelectOptions = [
        { value: 1, label: 'Integer' },
        { value: '2', label: 'String Number' },
        { value: 3.14, label: 'Decimal' },
        { value: 'date', label: 'Date' },
        { value: 'Some String', label: 'String String' },
      ];
      ['$oneOf', '$anyOf'].forEach((queryOperator) => {
        it(`Should be used to create dropdown items (${queryOperator})`, () => {
          act(() => {
            setupRender({
              label: 'This is a Label',
              queryOperator: queryOperator,
              selectOptions: testSelectOptions,
            });
          });

          fireEvent.mouseDown(screen.getByRole('button'));
          const listbox = within(screen.getByRole('listbox'));
          Object.values(testSelectOptions).forEach((text) => {
            expect(listbox.getByText(text.label)).toBeVisible();
          });
        }); // it -  create drop downs
        it(`Should create empty dropdown if no options supplied (${queryOperator})`, () => {
          act(() => {
            setupRender({
              label: 'This is a Label',
              queryOperator: queryOperator,
              selectOptions: null,
            });
          });

          fireEvent.mouseDown(screen.getByRole('button'));
          const listbox = within(screen.getByRole('listbox'));
          const x = screen.getByRole('listbox');
          expect(x).toBeDefined();
        }); // it -  create drop downs
      }); // forEach queryOperator
    });
  }); // describe('Properties',
}); //describe('InputMux'

// ----------------- Helpers
// queryExpression: QueryTermExpression;
// label: string;
// onChange: (newValue: TermValueWithLabelOrNull) => void;
// // selectOptions?: { [subjectId: string]: SelectOption[] };
// querySubjects: TermSubjectCollection;
const makeTestQueryExpression = (
  dataType: string,
  nodeId: string,
  subjectId: string,
  operator: string
): QueryTermExpression => {
  return {
    dataType,
    nodeId,
    subjectId: subjectId,
    operator: operator,
    value: null, // not sure if null is a better option
    mongoExpression: null,
  } as QueryTermExpression;
};

type PropertyObject = { [propName: string]: any };

const setupRender = (focusProps: PropertyObject = {}) => {
  const defaultProps = {
    // queryExpression: makeTestQueryExpression(),
    label: 'Test Label Not Set',
    onChange: (...arg: any) => {},
    querySubjects: dbFields,
  };

  const effectiveProps = {
    ...defaultProps,
    ...focusProps,
  } as PropertyObject;

  if (!effectiveProps.queryExpression) {
    effectiveProps.queryExpression = makeTestQueryExpression(
      effectiveProps.dataType || 'text',
      effectiveProps.nodeId || 'nodeIdTest001',
      effectiveProps.subjectId || 'testField.subjectId',
      effectiveProps.queryOperator || '$eq'
    );
  }

  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });
  //@ts-ignore
  return render(<InputMux {...effectiveProps} />);
};
const setupStatefulRender = (focusProps: PropertyObject = {}) => {
  const defaultProps = {
    // queryExpression: makeTestQueryExpression(),
    label: 'Test Label Not Set',
    onChange: (...arg: any) => {},
    querySubjects: dbFields,
  };

  const effectiveProps = {
    ...defaultProps,
    ...focusProps,
  } as PropertyObject;

  if (!effectiveProps.queryExpression) {
    effectiveProps.queryExpression = makeTestQueryExpression(
      effectiveProps.dataType || 'text',
      effectiveProps.nodeId || 'nodeIdTest001',
      effectiveProps.subjectId || 'testField.subjectId',
      effectiveProps.queryOperator || '$eq'
    );
  }

  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });

  const StatefulComponent = () => {
    const [qExpression, setQExpression] = useState(effectiveProps.queryExpression);

    const handleValueChange = (newValue: any) => {
      const newQExpression = Object.assign({}, qExpression);
      newQExpression.value = newValue;
      setQExpression(newQExpression);
      effectiveProps.onChange(newValue);
    };

    return (
      //@ts-ignore
      <InputMux
        {...effectiveProps}
        queryExpression={qExpression}
        onChange={handleValueChange}
        // initialValue={qExpression.value || ''}
      />
    );
  };

  //@ts-ignore
  return render(<StatefulComponent />);
};

const expectOnChangeBetweenExclusive = (
  _valueMin: string | number | undefined,
  _valueMax: string | number | undefined
) => {
  if (_valueMin && _valueMax) {
    return [{ $gt: _valueMin, $lt: _valueMax }];
  }
  if (_valueMin) {
    return [{ $gt: _valueMin }];
  }
  if (_valueMax) {
    return [{ $lt: _valueMax }];
  }
  return null;
};

const expectOnChangeBetweenInclusive = (
  _valueMin: string | number | undefined,
  _valueMax: string | number | undefined
) => {
  if (_valueMin && _valueMax) {
    return [{ $gte: _valueMin, $lte: _valueMax }];
  }
  if (_valueMin) {
    return [{ $gte: _valueMin }];
  }
  if (_valueMax) {
    return [{ $lte: _valueMax }];
  }
  return null;
};
