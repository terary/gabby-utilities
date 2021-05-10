import { I18N } from './index';
import customerSubjectDefJson from '../../s3-staging/query-definitions/customers/subjects.en-us.json';
import customerSubjectArMaJson from '../../s3-staging/query-definitions/customers/subjects.ar-ma.json';

import operatorLabelsJson from '../../s3-staging/query-definitions/operator-labels.en-us.json';
import operatorLabelsArMaJson from '../../s3-staging/query-definitions/operator-labels.ar-ma.json';
import { untestables } from './QueryExpressionLabelMaker';

import {
  QueryTermExpression,
  TermSubjectCollection,
} from '../components/QueryTermBuilder/types';

// const i18n = I18N('en-us');
const customerSubjectDef = (customerSubjectDefJson as unknown) as TermSubjectCollection;
const customerSubjectDef_armMa = (customerSubjectArMaJson as unknown) as TermSubjectCollection;

const operatorLabels = operatorLabelsJson; 
const operatorLabels_arMa = operatorLabelsArMaJson;

//     const queryLabelMaker = i18n.queryLabelMaker;

describe('I18N', () => {
  describe('QueryExpressionMaker', () => {
    let queryExpression: QueryTermExpression;
    let queryLabelMaker: any;
    let i18n: any;
    beforeEach(() => {
      i18n = I18N('en-us');
      queryLabelMaker = i18n.queryLabelMaker;
    });

    describe('en-us', () => {
      // maybe can mix/match betweenX and BetweenI - or not just a thought
      // Also need to do drop-through (not English)
      // wouldn't hurt try spanish (or arabic )

      ['$betweenX', '$betweenI'].forEach((op) => {
        describe(`${op} - for betweenX/betweenI `, () => {
          beforeEach(() => {
            queryExpression = {
              nodeId: '0',
              dataType: 'text',
              operator: op,
              subjectId: 'customers.firstName',
              value: null,
            } as QueryTermExpression;
          });
          it(`Should return between two values (${op})`, () => {
            queryExpression.value = {
              $gt: 'small',
              $gte: 'small',
              $lt: 'big',
              $lte: 'big',
            };
            expect(
              queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
            ).toBe('First Name between small and big');
          });
          it(`Should return "greater than [smaller]" value (if only small provided) (${op})`, () => {
            queryExpression.value = { $gt: 'small', $gte: 'small' };
            expect(
              queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
            ).toBe('First Name greater than small');
          });
          it(`Should return less than big (if only big provided) (${op})`, () => {
            queryExpression.value = { $lt: 'big', $lte: 'big' };
            expect(
              queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
            ).toBe('First Name less than big');
          });
          it(`Should be only field name if no value (${op})`, () => {
            expect(
              queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
            ).toBe('First Name ');
          });
          it(`(dev) Should return "NULL" if QueryExpression is null (${op})`, () => {
            // more near prod time this will be an empty string
            expect(queryLabelMaker(null, customerSubjectDef, operatorLabels)).toBe(
              'NULL' // dev purposes should be empty string
            );
          });
        }); // forEach (betweenI/betweenX)
      }); // describe('betweeni/betweenx'
      ['$eq', '$gt', '$gte', '$lt', '$lte'].forEach((op) => {
        describe(`${op}`, () => {
          beforeEach(() => {
            queryExpression = {
              nodeId: '0',
              dataType: 'date',
              operator: op,
              subjectId: 'customers.firstName',
              value: null,
            } as QueryTermExpression;
          });
          it('Should return [subject] [operator] [empty string for value], when value null', () => {
            const opLabel = operatorLabels[queryExpression.operator].long;

            expect(
              queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
            ).toBe(`First Name ${opLabel} `);
          });
          it('Should return [subject] [operator] [value], when value is set (with quotes if string/date)', () => {
            const opLabel = operatorLabels[queryExpression.operator].long;
            queryExpression.value = 'my awesome value';
            expect(
              queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
            ).toBe(`First Name ${opLabel} 'my awesome value'`);
          });
          it('Should return [subject] [operator] [value], when value is set (without quotes if number)', () => {
            const opLabel = operatorLabels[queryExpression.operator].long;
            queryExpression.value = 'my awesome value';
            queryExpression.dataType = 'decimal';
            expect(
              queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
            ).toBe(`First Name ${opLabel} my awesome value`);
          });
          it('(Dev) Should return empty string when QueryExpression is null. dev sends "NULL" ', () => {
            queryExpression.value = 'my awesome value';
            expect(queryLabelMaker(null, customerSubjectDef, operatorLabels)).toBe(`NULL`);
          });
        }); // describe op
      }); // foreach ['$eq', '$gt', '$gte', '$lt', '$lte']
      describe('$anyOf', () => {
        beforeEach(() => {
          queryExpression = {
            nodeId: '0',
            dataType: 'date',
            operator: '$anyOf',
            subjectId: 'customers.daysOff',
            value: null,
          } as QueryTermExpression;
        });

        it(`Should return [subject] [operator] ['v1', 'v2, 'v3'], when value is set (with quotes if string/date)`, () => {
          const opLabel = operatorLabels[queryExpression.operator].long;
          queryExpression.value = ['Tuesday', 'Wednesday'];
          expect(
            queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
          ).toBe(`Days Off ${opLabel} 'Tuesday', 'Wednesday'`);
        });
        it(`Should return [subject] [operator] [v1, v2, v3], when value is set (without quotes if number)`, () => {
          const opLabel = operatorLabels[queryExpression.operator].long;
          queryExpression.value = ['Tuesday', 'Wednesday'];
          queryExpression.dataType = 'integer';
          expect(
            queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
          ).toBe(`Days Off ${opLabel} Tuesday, Wednesday`);
        });
        it(`Should return [subject] [operator] [empty string], when value is null`, () => {
          const opLabel = operatorLabels[queryExpression.operator].long;
          queryExpression.value = null;
          expect(
            queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
          ).toBe(`Days Off ${opLabel} `);
        });
        it(`(DEV) Should return empty string when queryExpression is null (Dev)`, () => {
          queryExpression.value = null;
          expect(queryLabelMaker(null, customerSubjectDef, operatorLabels)).toBe(`NULL`);
        });
      });// describe $anyOf
      describe('$oneOf', () => {
        beforeEach(() => {
          queryExpression = {
            nodeId: '0',
            dataType: 'date',
            operator: '$oneOf',
            subjectId: 'customers.favoriteFruit',
            value: null,
          } as QueryTermExpression;
        });
        it(`Should return [subject] [operator] '[Selected Label]', when value is set (with quotes if string/date)`, () => {
          const opLabel = operatorLabels[queryExpression.operator].long;
          queryExpression.value = 'apples0001';
          expect(
            queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
          ).toBe(`Favorite Fruit ${opLabel} 'Green Apple'`);
        });
        it(`Should return [subject] [operator] '[Selected Label]', when value is set (without quotes if number)`, () => {
          const opLabel = operatorLabels[queryExpression.operator].long;
          queryExpression.dataType = 'integer';
          queryExpression.value = 'apples0001';
          expect(
            queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
          ).toBe(`Favorite Fruit ${opLabel} Green Apple`);
        });
        it(`Should return [subject] [operator] '[Empty String]', when value is null (without quotes if number)`, () => {
          const opLabel = operatorLabels[queryExpression.operator].long;
          queryExpression.value = null;
          expect(
            queryLabelMaker(queryExpression, customerSubjectDef, operatorLabels)
          ).toBe(`Favorite Fruit ${opLabel} ''`);
        });
        it(`(DEV) Should return empty string when queryExpression is null (Dev)`, () => {
          expect(queryLabelMaker(null, customerSubjectDef, operatorLabels))
          .toBe('NULL');
        });
      }); // describe $oneOf
    });
    describe('unknown locale', () => {
      beforeEach(() => {
        i18n = I18N('en-us');
        queryLabelMaker = i18n.queryLabelMaker;
      });
      it('Should default to en-us if locale is unknown', () => {
        const i18n_en = I18N('en-us');
        const i18n_unknown = I18N('unknown');
        const queryLabelMaker_en = i18n_en.queryLabelMaker;
        const queryLabelMaker_unknown  = i18n_unknown.queryLabelMaker;

        expect(i18n_en).toStrictEqual(i18n_unknown);
        expect(queryLabelMaker_en).toBe(queryLabelMaker_unknown);
      });
    });
  describe('Arabic Morocco (ar-MA)', () => {
      beforeEach(() => {
        i18n = I18N('ar-ma');
        queryLabelMaker = i18n.queryLabelMaker;
      });
      describe('$anyOf', () => {
        beforeEach(() => {
          queryExpression = {
            nodeId: '0',
            dataType: 'date',
            operator: '$anyOf',
            subjectId: 'customers.daysOff',
            value: null,
          } as QueryTermExpression;
        });
        it(`Should return [subject] [operator] ['v1', 'v2, 'v3'], when value is set (with quotes if string/date)`, () => {
          const opLabel = operatorLabels_arMa[queryExpression.operator].long;
          queryExpression.value = ['Tuesday', 'Wednesday'];
          expect(
            queryLabelMaker(
              queryExpression,
              customerSubjectDef_armMa,
              operatorLabels_arMa
            )
          ).toBe(`أيام العطلة ${opLabel} 'Tuesday', 'Wednesday'`);
        });
        it(`Should return [subject] [operator] [v1, v2, v3], when value is set (without quotes if number)`, () => {
          const opLabel = operatorLabels_arMa[queryExpression.operator].long;
          queryExpression.value = ['Tuesday', 'Wednesday'];
          queryExpression.dataType = 'integer';
          expect(
            queryLabelMaker(queryExpression, customerSubjectDef_armMa, operatorLabels_arMa)
          ).toBe(`أيام العطلة ${opLabel} Tuesday, Wednesday`);
        });
        it(`Should return [subject] [operator] [empty string], when value is null`, () => {
          const opLabel = operatorLabels_arMa[queryExpression.operator].long;
          queryExpression.value = null;
          expect(
            queryLabelMaker(
              queryExpression,
              customerSubjectDef_armMa,
              operatorLabels_arMa
            )
          ).toBe(`أيام العطلة ${opLabel} `);
        });
        it(`(DEV) Should return empty string when queryExpression is null (Dev)`, () => {
          queryExpression.value = null;
          expect(queryLabelMaker(null, customerSubjectDef_armMa, operatorLabels_arMa)).toBe(`NULL`);
        });
      }); // describe $anyOf
    }); // describe('en-us')
  });
  describe('Untestables', () => {
    it('labelifyRangeValue - Should be only field name if values are falsy', () => {
      const value = {
        $min: undefined,
        $max: undefined,
      } as { $min: any; $max: any } ;
      expect(untestables.labelifyRangeValue(value)).toBe('');
    });
    describe('#extractLabelFromOptions', () => {
      const options = [ 
        { label: 'One', value: 'one001' },
        { label: 'Two', value: 'two0002' },
        { label: 'First Thing', value: 'same' },
        { label: 'Second Thing', value: 'same' },
        { label: 'Three', value: 'three001' },
      ];
      it('Should label for a given value', () => {
        expect(untestables.extractLabelFromOptions('two0002', options)).toBe('Two');
      });
      it('Should return label for first found value- no concern given to unique value', () => {
        expect(untestables.extractLabelFromOptions('same', options)).toBe('First Thing');
      });
      it('Should empty string  if value not found', () => {
        expect(untestables.extractLabelFromOptions('Does Not Exist', options)).toBe('');
      });
      it('Should empty string  if value not found without options', () => {
        expect(untestables.extractLabelFromOptions('Does Not Exist')).toBe('');
      });
    });
    describe('enUsOpLabel', () => {
      it('Should return empty string if query expression is null', () => {
        expect(untestables.enUsOpLabel(null, operatorLabels)).toBe('');
      })
    })
  });
});
