import { DBFieldCollection, DBField, FIELD_DATA_TYPE } from '../types';

export const tblCustomerFields = {
  fname: {
    label: 'First Name',
    datatype: FIELD_DATA_TYPE.STRING,
  } as DBField,
  lname: {
    label: 'First Name',
    datatype: FIELD_DATA_TYPE.STRING,
  } as DBField,
  birthday: {
    label: 'First Name',
    datatype: FIELD_DATA_TYPE.DATE,
  } as DBField,
  avgIncome: {
    label: 'First Name',
    datatype: FIELD_DATA_TYPE.NUMBER,
  } as DBField,
} as DBFieldCollection;
