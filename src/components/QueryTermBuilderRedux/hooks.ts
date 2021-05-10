import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectByNodeId,
  selectExpressionByNodeId,
  removeNode,
  appendNode,
  selectChildrenIdsOf,
  toggleJunctionOperator,
  updateNodeExpression,
  openForEdit,
} from './slice';



export const useQEUtils = (nodeId: string) => {
  console.log(`useQEUtils called for nodeId: '${nodeId}'`);
  const [expressionCopy, setExpressionCopy] = useState(useSelector(selectExpressionByNodeId(nodeId)))
  const [nodeCopy, setNodeCopy] = useState(Object.assign({}, useSelector(selectByNodeId(nodeId))))
 
  return {
    nodeSelector: useSelector(selectByNodeId(nodeId)),
    nodeCopy,
    expressionSelector: useSelector(selectExpressionByNodeId(nodeId)),
    expressionCopy,
  };
}