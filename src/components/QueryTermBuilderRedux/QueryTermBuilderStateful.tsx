import React, { useEffect } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import { QueryTermExpression } from '../QueryTermBuilder/types';
import { InputDataType } from '../common.types';
import { addRootNode, appendNode, selectChildrenIdsOf } from './slice';

import { TermViewer } from './TermViewer';

export const QueryTermBuilderStateful = () => {
  const rootNodeId = '0';
  /*
    shouldn't be at component level - ? module level?
    something to consider if user will have multiple queries
  */
  const dispatch = useDispatch();
  // const childrenNodes = useSelector(selectChildrenIdsOf('0')) || [];

  const debugMakeFakeTermExpression = () => {
    return {
      nodeId: '0',
      operator: '$eq',
      value: `I am root and my value is: ` + Math.random(),
      subjectId: 'customers.lastName',
      dataType: 'text' as InputDataType,
    } as QueryTermExpression;
  };
  // const handleAddChild = () => {
  //   dispatch(
  //     appendNode({
  //       parentNodeId: '0',
  //       expression: debugMakeFakeTermExpression('namelessChild'),
  //     })
  //   );
  // };


  // const handleInsertClick = () => {
  //   const nodeId = rootNodeId + ':' + childrenNodes.length;
  //   const termExpression = {
  //     nodeId,
  //     operator: '$eq',
  //     value: 'Fish Sticks',
  //     subjectId: 'customers.lastName',
  //     dataType: 'text' as InputDataType,
  //   } as QueryTermExpression;

  //   const theAction = {
  //     nodeId,
  //     expression: termExpression,
  //     junctionOperator: '$and' as '$and',
  //     parentNodeId: rootNodeId,
  //   };
  //   dispatch(addRootNode(theAction));
  //   // await store.dispatch(insertDidThunk(theActions));
  // };

  // const onStartUp = () => {
  //   dispatch(
  //     appendNode({
  //       parentNodeId: '0',
  //       expression: debugMakeFakeTermExpression('namelessChild'),
  //     })
  //   );
  // };
  useEffect(() => {
    dispatch(
      addRootNode({
        parentNodeId: '0',
        expression: debugMakeFakeTermExpression(),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TermViewer nodeId="0" />;
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
