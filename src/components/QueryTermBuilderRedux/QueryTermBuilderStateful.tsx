import React, { useEffect } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import { QueryTermExpression } from '../QueryTermBuilder/types';
import { InputDataType } from '../common.types';
// import {
//   queryNodeAdded,
//   // allQueryNodes,
//   selectChildrenIdsOf,
//   // MyAwesomeAllSelector,
// } from './slice';
import {
  queryNodeAdded,
  // allQueryNodes,
  selectChildrenIdsOf,
  // MyAwesomeAllSelector,
} from './selectors';

import { TermViewer } from './TermViewer';
import { NoteAddOutlined } from '@material-ui/icons';


export const QueryTermBuilderStateful = () => {
  const rootNodeId = '0';
  /*
    shouldn't be at component level - ? module level?
    something to consider if user will have multiple queries
  */
  const dispatch = useDispatch();

  // const listSelector = (state: QueryTermCollection) => {
  //   return state.didItems;
  // };
  const listAllSelector = (state: any) => {
    return state.queryNodes.entities;
  };

  // const didList: QueryTermExpression = useSelector(listSelector);
  // const didList2 = useSelector(listAllSelector);
  // const childrenNodes = useSelector(selectChildrenIdsOf('0')) || [];
  // const queryNodes = useSelector(MyAwesomeAllSelector);
  const childrenNodes = useSelector(selectChildrenIdsOf('0')) || [];

  const handleInsertClick = () => {
    const nodeId = rootNodeId + ':' + childrenNodes.length;
    // type QueryNode = {
    //   nodeId: string;
    //   expression: QueryTermExpression;
    //   parentNodeId: string;
    // };
    const termExpression = {
      // didThing: makeDidThingy(),
      // 'node0:3': {
      nodeId,
      operator: '$eq',
      value: 'Fish Sticks',
      subjectId: 'field003',
      dataType: 'text' as InputDataType,
      // },
    } as QueryTermExpression;

    const theAction = {
      nodeId,
      expression: termExpression,
      junctionOperator: '$and' as '$and',
      parentNodeId: rootNodeId,
    };

    dispatch(queryNodeAdded(theAction));
    // await store.dispatch(insertDidThunk(theActions));
  };

  const onStartUp = () => {};
  useEffect(() => {
    onStartUp();
  }, []);

  return (
    <div>
      <h2>Debug Stuff</h2>
      <hr />
      DidList (did Dictionary): <br />
      <p>has {childrenNodes.length} children</p>
      <button onClick={handleInsertClick}> Who'da thunked it </button>
      {childrenNodes.map((child, idx) => {
        return <TermViewer key={idx} nodeId={child as string} />;
      })}
      {/* <ul>
      childrenNodes
        {Object.entries(didList2 || {}).map(([nodeId, queryTerm]) => {
          return (
            <li key={nodeId}>
              <TermViewer nodeId={nodeId} />
            </li>
          );
        })}
      </ul> */}
    </div>
  );
};
