import {
  createEntityAdapter,
  createSelector,
  createSlice,
  configureStore,
  EntityId,
} from '@reduxjs/toolkit';

// slice and selectors depend no each other and both
// depend on ../store.  The file depnedencies are wacked. 
import { selectChildrenIdsOf, selectSiblingIdsOf } from './selectors';

import { QueryTermExpression } from '../QueryTermBuilder/types';

type QueryBranchExpression = {
  junctionOperator: '$and' | '$or';
};

type QueryNode = {
  nodeId: string;
  expression: QueryTermExpression | null;
  junctionOperator: '$and' | '$or' | null;
  // isLeaf = junctionOperator === null
  // isBranch junctionOperator !== null
  // if(isBranch) -> expression = null
  // nodeExpression: QueryTermExpression | QueryBranchExpression;
  parentNodeId: string;
};
type QueryNodeCollection = { [nodeId: string]: QueryNode };

export const queryNodeAdapter = createEntityAdapter<QueryNode>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (queryNode: QueryNode) => queryNode.nodeId,

  // Keep the "all IDs" array sorted based on book titles
  // *tmc* IDs are sorted
  sortComparer: (a, b) => a.nodeId.localeCompare(b.nodeId),
});

const queryNodeSlice = createSlice({
  name: 'queryNodes',
  initialState: queryNodeAdapter.getInitialState(),
  reducers: {
    // Can pass adapter functions directly as case reducers.  Because we're passing this
    // as a value, `createSlice` will auto-generate the `bookAdded` action type / creator

    // bookAdded: booksAdapter.addOne,
    queryNodeAdded: queryNodeAdapter.addOne,
    addChildToNode: (state, action) => {
      queryNodeAdapter.addOne(state, action.payload);
    },
    addChildToNode2: (state, action) => {
      // const theAction = {
      //   nodeId: childNodeId,
      //   expression: termExpression,
      //   junctionOperator: null,
      //   parentNodeId: nodeId,
      // };
      const { expression, parentNodeId } = action.payload;
      const parentsChildren = selectChildrenIdsOf(parentNodeId)({ queryNodes: state });
      let newChildNodeId = parentNodeId + ':' + parentsChildren.length;
      if (parentsChildren.length === 0) {
        newChildNodeId = parentNodeId + ':1';
        const parentNode = state.entities[parentNodeId];
        const promoteFirstChildPayload = {
          nodeId: parentNodeId + ':0',
          expression: { ...parentNode?.expression, ...{ nodeId: parentNodeId + ':0' } },
          // expression: parentNode?.expression,
          junctionOperator: null,
          parentNodeId: parentNodeId,
        };
        if (parentNode) {
          parentNode.expression = null;
          queryNodeAdapter.updateOne(state, { id: parentNodeId, changes: parentNode });
        }

        queryNodeAdapter.addOne(state, promoteFirstChildPayload as QueryNode);
      }

      const newQueryNode = {
        nodeId: newChildNodeId,
        expression: { ...expression, ...{ nodeId: newChildNodeId } },
        junctionOperator: null,
        parentNodeId,
      };
      queryNodeAdapter.addOne(state, newQueryNode as QueryNode);
    },
    updateQueryNode: queryNodeAdapter.updateOne,
    removeManyQueryNodes: queryNodeAdapter.removeMany,
    removeManyQueryNodes2: (state, action) => {
      const thisNodeId = action.payload;
      const mySiblings = selectSiblingIdsOf(thisNodeId)({ queryNodes: state });
      const nodesToBeRemoved = selectChildrenIdsOf(thisNodeId)({ queryNodes: state });
      nodesToBeRemoved.push(thisNodeId);
      if (mySiblings.length === 1) {
        nodesToBeRemoved.push(mySiblings[0]);
        const siblingNode = state.entities[mySiblings[0]];
        if (siblingNode) {
          const parent = state.entities[siblingNode.parentNodeId];
          if (parent) {
            parent.expression = siblingNode.expression;
          }
        }
      }
      queryNodeAdapter.removeMany(state, nodesToBeRemoved);
    },
    // promoteChild: (state, action) => {
    //   const childId = action.payload.childId;
    //   const child = state.entities[childId];
    //   if (child) {
    //     const parent = state.entities[child.parentNodeId];
    //     if (parent) {
    //       parent.expression = child?.expression || null;
    //     }
    //   }
    // }

    // queryNodeReceived(state, action) {
    //   // Or, call them as "mutating" helpers in a case reducer
    //   queryNodeAdapter.setAll(state, action.payload.queryNode);
    // },
    // bookAdded: booksAdapter.addOne,
    // booksLoading(state, action) {
    //   if (state.loading === 'idle') {
    //     state.loading = 'pending'
    //   }
    // },
    // booksReceived(state, action) {
    //   if (state.loading === 'pending') {
    //     // Or, call them as "mutating" helpers in a case reducer
    //     booksAdapter.setAll(state, action.payload)
    //     state.loading = 'idle'
    //   }
    // },
    // bookUpdated: booksAdapter.updateOne
  },
});
export default queryNodeSlice;
