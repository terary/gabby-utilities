export type Subfield = {
  label: string;
  id: string;
  intialValue?: string | number;
};

export type DoubleValueFields = {
  min: Subfield;
  max: Subfield;
};

export type ClickHanlder = () => void;
