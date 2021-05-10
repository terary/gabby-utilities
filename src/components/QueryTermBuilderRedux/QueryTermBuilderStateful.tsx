import React, { useEffect } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import { QueryTermExpression, TermOperatorLabelCollection, TermSubjectCollection } from '../QueryTermBuilder/types';
import { InputDataType } from '../common.types';
import { addRootNode, appendNode, selectChildrenIdsOf } from './slice';
import { QELabelMaker } from './types';
import { TermViewer } from './TermViewer';
import { defaultExpressionLabelMaker } from './defaultLabelMaker';
import {QueryNode} from './slice';
//

interface QueryTermBuilderStatefulProps {
  opLabels: TermOperatorLabelCollection;
  subjects: TermSubjectCollection;
  labelMaker?: QELabelMaker;
  initialExpression?: { [nodeId: string]: QueryNode };
}

export const QueryTermBuilderStateful = ({
  opLabels,
  subjects,
  labelMaker = defaultExpressionLabelMaker,
  initialExpression,
}: QueryTermBuilderStatefulProps) => {
  const rootNodeId = '0';

  /*
    shouldn't be at component level - ? module level?
    something to consider if user will have multiple queries
  */
  const dispatch = useDispatch();

  const debugMakeFakeTermExpression = () => {
    const subjectId = subjects['customers.lastName']
      ? 'customers.lastName'
      : 'students.lastName';
    return {
      nodeId: '0',
      operator: '$eq',
      value: `I am root and my value is: ` + Math.random(),
      // subjectId: 'customers.lastName',
      subjectId,
      dataType: 'text' as InputDataType,
    } as QueryTermExpression;
  };

  useEffect(() => {
    dispatch(
      addRootNode({
        parentNodeId: '0', // <-- parentNode is not necessary
        expression: debugMakeFakeTermExpression(),
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TermViewer
        key="root"
        nodeId="0"
        opLabels={opLabels}
        subjects={subjects}
        labelMaker={labelMaker}
      />
      ;
      {/* <h2>QueryTermBuilderStateful</h2>
      <hr />
      <p>has {childrenNodes.length} children</p>
      <button onClick={handleInsertClick}> Who'da thunked it </button>
      {childrenNodes.map((child, idx) => {
        return <TermViewer key={idx} nodeId={child as string} />;
      })} */}
    </div>
  );
};
