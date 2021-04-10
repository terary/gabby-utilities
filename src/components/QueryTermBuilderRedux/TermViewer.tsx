import React, { useEffect } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import { QueryTermExpression } from '../QueryTermBuilder/types';
// import { selectByNodeId } from './slice';
// import {
//   queryNodeAdded,
//   removeManyQueryNodes,
//   removeManyQueryNodes2,
//   addChildToNode,
//   addChildToNode2,
//   updateQueryNode,
//   selectChildrenIdsOf,
//   // promoteChild,
// } from './slice';
import {
  selectByNodeId,
  queryNodeAdded,
  removeManyQueryNodes,
  removeManyQueryNodes2,
  addChildToNode,
  addChildToNode2,
  updateQueryNode,
  selectChildrenIdsOf,
  // promoteChild,
} from './selectors';

import { InputDataType } from '../common.types';
import { EntityId } from '@reduxjs/toolkit';
interface TermViewerProps {
  nodeId: string;
}

export const TermViewer = ({ nodeId }: TermViewerProps) => {
  const dispatch = useDispatch();
  const thisQueryNode = useSelector(selectByNodeId(nodeId));
  // this ids?
  const childrenNodes = useSelector(selectChildrenIdsOf(nodeId)) || [];

  // useEffect(() => {
  //   if (childrenNodes.length === 1) {
  //     const theAction = {
  //       lastChildNodeId: childrenNodes[0]
  //     }
  //     dispatch(promoteLastChild(lastChildNodeId));
  //   }
  // }, [childrenNodes, dispatch]);

  const promoteChildToMyExpression = () => {
    const childNodeId = nodeId + ':0'; // this will be an issue
    const theAction = {
      childId: childNodeId,
      // expression: childExpression,
      // junctionOperator: null,
      // parentNodeId: nodeId,
    };

    // dispatch(promoteChild(theAction));
  };

  const demoteMyExpressionToFirstChild = () => {
    const childNodeId = nodeId + ':0'; // this will be an issue
    const childExpression = {
      ...(thisQueryNode || {}).expression,
      ...{ nodeId: childNodeId },
    };
    // thisQueryNode?.expression?.nodeId = childNodeId;
    const theAction = {
      nodeId: childNodeId,
      expression: childExpression,
      junctionOperator: null,
      parentNodeId: nodeId,
    };

    dispatch(addChildToNode(theAction));
    // dispatch(addChildToNode(theUpdateMeAction));
    dispatch(
      updateQueryNode({
        id: nodeId,
        changes: { expression: null, junctionOperator: '$or' },
      })
    );
  };

  const debugMakeFakeTermExpression = (childNodeId: string) => {
    return {
      nodeId: childNodeId,
      operator: '$eq',
      value: `my parent is: ${thisQueryNode?.nodeId} and my value is: ` + Math.random(),
      subjectId: 'field003',
      dataType: 'text' as InputDataType,
    } as QueryTermExpression;
  };
  const handleRemoveMe = () => {
    // childrenNodes
    if (childrenNodes.length === 2) {
      promoteChildToMyExpression();
    }
    const nodeIds = childrenNodes.concat([nodeId]) as EntityId[];
    // dispatch(removeManyQueryNodes(nodeIds));
    dispatch(removeManyQueryNodes2(nodeId));
  };

  const x_handleAddChild = () => {
    if (childrenNodes.length === 0) {
      demoteMyExpressionToFirstChild();
      const childNodeId = nodeId + ':1';
      const termExpression = debugMakeFakeTermExpression(childNodeId);
      const theAction = {
        nodeId: childNodeId,
        expression: termExpression,
        junctionOperator: null,
        parentNodeId: nodeId,
      };
      dispatch(addChildToNode(theAction));
    } else {
      const childNodeId = nodeId + ':' + childrenNodes.length;
      const termExpression = debugMakeFakeTermExpression(childNodeId);
      const theAction = {
        nodeId: childNodeId,
        expression: termExpression,
        junctionOperator: null,
        parentNodeId: nodeId,
      };
      dispatch(addChildToNode(theAction));
    }
  };

  const handleAddChild = () => {
    // if (childrenNodes.length === 0) {
    //   demoteMyExpressionToFirstChild();
    //   const childNodeId = nodeId + ':1';
    //   const termExpression = debugMakeFakeTermExpression(childNodeId);
    //   const theAction = {
    //     nodeId: childNodeId,
    //     expression: termExpression,
    //     junctionOperator: null,
    //     parentNodeId: nodeId,
    //   };
    //   dispatch(addChildToNode(theAction));
    // } else {
    //   const childNodeId = nodeId + ':' + childrenNodes.length;
    //   const termExpression = debugMakeFakeTermExpression(childNodeId);
    //   const theAction = {
    //     nodeId: childNodeId,
    //     expression: termExpression,
    //     junctionOperator: null,
    //     parentNodeId: nodeId,
    //   };
    //   dispatch(addChildToNode(theAction));
    // }

    dispatch(
      addChildToNode2({
        parentNodeId: nodeId,
        expression: debugMakeFakeTermExpression('namelessChild'),
      })
    );
  };

  const onStartUp = () => {};
  const bgColor = () => {
    return childrenNodes.length > 0 ? 'green' : 'red';
  };

  useEffect(() => {
    onStartUp();
  }, []);

  const getMyExpression = () => {
    if (!thisQueryNode) {
      return 'No Query Node Found';
    }
    if (thisQueryNode.expression === null) {
      return 'Query Expression is null (product of my children)';
    }
    return JSON.stringify(thisQueryNode);
  };

  return (
    <div
      style={{
        backgroundColor: bgColor(),
        border: '1px black solid',
        borderRadius: '5px',
        margin: 5,
      }}
    >
      <h4>
        Node ID: {nodeId}, Expression {getMyExpression()}
      </h4>
      <p>has {childrenNodes.length} children</p>
      {/* <p>{JSON.stringify(childrenNodes)}</p> */}
      <button onClick={handleAddChild}> Add Child </button>
      <button onClick={handleRemoveMe}> Remove Me </button>

      {/* {JSON.stringify(thisQueryNode)} */}
      {childrenNodes.map((child, idx) => {
        return <TermViewer key={idx} nodeId={child as string} />;
      })}
    </div>
  );
};
