import { queryLabelMaker } from '../../i18n/QueryExpressionLabelMaker';
import {useQEUtils} from './hooks';
import { QELabelMaker } from './types';
import { ButtonBar } from './ButtonBar';
import {
  QueryTermExpression,
  TermOperatorLabelCollection,
  TermSubjectCollection,
} from '../QueryTermBuilder/types';

interface TermViewer2Props {
  nodeId: string;
  labelMaker: QELabelMaker;
  opLabels: TermOperatorLabelCollection;
  subjects: TermSubjectCollection;
}

export const TermViewer2 = ({
  nodeId,
  labelMaker,
  opLabels,
  subjects,
}: TermViewer2Props) => {
  const {nodeSelector, nodeCopy, expressionSelector, expressionCopy }  = useQEUtils(nodeId);

  return (
    <>
      view node ID: {nodeId}
      {labelMaker(expressionCopy, subjects, opLabels)}
      <ButtonBar nodeId={nodeId} subjects={subjects} />
    </>
  );
}