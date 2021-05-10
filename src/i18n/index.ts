import { queryLabelMaker } from './QueryExpressionLabelMaker';

export const I18N = (locale: string) => {
  return {
    queryLabelMaker: queryLabelMaker(locale),
  };
};
