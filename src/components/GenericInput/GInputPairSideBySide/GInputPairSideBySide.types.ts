import { Subfield } from '../../../common/types';

export type { Subfield };
// export type Subfield = {
//   label: string;
//   id: string;
//   initialValue?: string | number;
// };

export type DoubleValueFields = {
  min: Subfield;
  max: Subfield;
};

export type ClickHandler = () => void;
