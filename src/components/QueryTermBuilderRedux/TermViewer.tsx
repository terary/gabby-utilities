import React, { useEffect } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import { QueryTermExpression } from '../QueryTermBuilder/types';
import {
  selectByNodeId,
  removeNode,
  appendNode,
  selectChildrenIdsOf,
} from './slice';

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
    dispatch(removeNode(nodeId));
  };

  const handleAddChild = () => {
    dispatch(
      appendNode({
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
