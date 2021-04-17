import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import { QueryTermExpression } from '../QueryTermBuilder/types';
import {
  selectByNodeId,
  removeNode,
  appendNode,
  selectChildrenIdsOf,
  toggleJunctionOperator,
} from './slice';

import { JunctionSwitch } from './JunctionSwitch';

import { InputDataType } from '../common.types';
import { TermEditorSandbox } from '../../Sandboxes/QueryTermEditorSandbox';
import { TermEditor } from './TermEditor';
interface TermViewerProps {
  nodeId: string;
}

enum NodeTypeEnum {
  ROOT = 'ROOT',
  BRANCH = 'BRANCH',
  LEAF = 'LEAF',
}

export const TermViewer = ({ nodeId }: TermViewerProps) => {
  const [isOpenForEdit, setIsOpenForEdit] = useState(false);
  const dispatch = useDispatch();
  const thisQueryNode = useSelector(selectByNodeId(nodeId));
  // this ids?
  const childrenNodes = useSelector(selectChildrenIdsOf(nodeId)) || [];

  const debugMakeFakeTermExpression = (childNodeId: string) => {
    return {
      nodeId: childNodeId,
      operator: '$eq',
      value: `my parent is: ${thisQueryNode?.nodeId} and my value is: ` + Math.random(),
      subjectId: 'customers.lastName',
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

  const handleJunctionOpChange = () => {
    // toggleJunctionOperator
    dispatch(toggleJunctionOperator({ nodeId }));
  }

  return (
    <div
      style={{
        backgroundColor: bgColor(),
        border: '1px black solid',
        borderRadius: '5px',
        margin: 5,
      }}
    >
      {thisQueryNode?.junctionOperator && (
        <JunctionSwitch
          onChange={handleJunctionOpChange}
          junctionOperator={thisQueryNode.junctionOperator}
        />
      )}
      <h4>
        Node ID: {nodeId}, Expression {getMyExpression()}
      </h4>
      {JSON.stringify(thisQueryNode)}
      <p>has {childrenNodes.length} children</p>
      {/* <p>{JSON.stringify(childrenNodes)}</p> */}
      <button onClick={handleAddChild}> Add Child </button>
      <button onClick={handleRemoveMe}> Remove Me </button>
      {childrenNodes.length === 0 && (
        <button
          onClick={() => {
            setIsOpenForEdit(!isOpenForEdit);
          }}
        >
          Edit Me
        </button>
      )}
      {isOpenForEdit && <TermEditor nodeId={nodeId} />}

      {/* {JSON.stringify(thisQueryNode)} */}
      {childrenNodes.map((child, idx) => {
        return <TermViewer key={idx} nodeId={child as string} />;
      })}
    </div>
  );
};
