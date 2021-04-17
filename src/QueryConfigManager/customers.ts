import {
  TermSubjectCollection,
  TermOperatorLabelCollection,
} from '../components/QueryTermBuilder/types';

const selectFruitOptions = [
  { value: 'apples0001', label: 'Green Apple' },
  { value: 'apples0002', label: 'Red Apple' },
  { value: 'grapes001', label: 'Grapes' },
  { value: 'bananas0001', label: 'Banana' },
];

const selectDaysOfTheWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export const dbFields = {
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
    queryOps: ['$eq', '$lt', '$lte', '$gt', '$gte', '$regex', '$betweenX', '$betweenI'],
  },
  'customers.annualSalary': {
    id: 'customers.annualSalary',
    label: 'Annual Salary',
    dataType: 'decimal',
    queryOps: ['$eq', '$lt', '$lte', '$gt', '$gte', '$regex', '$betweenX', '$betweenI'],
  },
  'customers.memberSince': {
    id: 'customers.memberSince',
    label: 'Member Since',
    dataType: 'date',
    queryOps: ['$eq', '$lt', '$lte', '$gt', '$gte', '$regex', '$betweenX', '$betweenI'],
  },
  'customers.numberOfChildren': {
    id: 'customers.numberOfChildren',
    label: 'Number of Children',
    dataType: 'integer',
    queryOps: ['$eq', '$lt', '$lte', '$gt', '$gte', '$regex', '$betweenX', '$betweenI'],
  },
  'customers.favoriteFruit': {
    id: 'customers.favoriteFruit',
    label: 'Favorite Fruit',
    dataType: 'text',
    queryOps: ['$oneOf'],
    selectOptions: selectFruitOptions, // this could be defined inline (in DTO)
  },
  'customers.daysOff': {
    id: 'customers.daysOff',
    label: 'Days Off',
    dataType: 'text',
    queryOps: ['$anyOf'],
    selectOptions: selectDaysOfTheWeek,
  },
} as TermSubjectCollection;


export const operatorLabels = {
  $eq: {
    long: 'Is',
    short: '=',
  },
  $lt: {
    long: 'Less Than',
    short: '<',
  },
  $gt: {
    long: 'Greater Than',
    short: '>',
  },
  $lte: {
    long: 'Less or Equal ',
    short: '=<',
  },
  $gte: {
    long: 'Greater or Equal ',
    short: '>=',
  },
  $regex: {
    long: 'Contains',
    short: 'has',
  },
  // $in: {
  //   long: 'One Of',
  //   short: 'in',
  // },
  $anyOf: {
    long: 'Any Of',
    short: 'in',
  },
  $oneOf: {
    long: 'One Of',
    short: 'is',
  },
  $betweenX: {
    long: 'Between',
    short: 'between',
  },
  $betweenI: {
    long: 'BetweenI',
    short: 'between',
  },
} as TermOperatorLabelCollection;

const QueryConfigCustomers = {
  termSubjects: dbFields,
  compareOperatorLabels: operatorLabels,
};

export default QueryConfigCustomers;
