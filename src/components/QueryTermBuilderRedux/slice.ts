import { createEntityAdapter, createSlice, configureStore } from '@reduxjs/toolkit';

import { QueryTermExpression } from '../QueryTermBuilder/types';

type QueryBranchExpression = {
  junctionOperator: '$and' | '$or';
};

export type QueryNode = {
  // isLeaf = junctionOperator === null
  // isBranch junctionOperator !== null
  // if(isBranch) -> expression = null
  // nodeExpression: QueryTermExpression | QueryBranchExpression;
  nodeId: string;
  expression: QueryTermExpression | null;
  junctionOperator: '$and' | '$or' | null;
  parentNodeId: string;
};

const queryNodeAdapter = createEntityAdapter<QueryNode>({
  selectId: (queryNode: QueryNode) => queryNode.nodeId,

  // *tmc* How are IDs sorted
  sortComparer: (a, b) => a.nodeId.localeCompare(b.nodeId),
});

const queryNodeSlice = createSlice({
  name: 'queryNodes',
  initialState: queryNodeAdapter.getInitialState(),
  reducers: {
    queryNodeAdded: queryNodeAdapter.addOne,
    toggleJunctionOperator: (state, action) => {
      const { nodeId } = action.payload;
      const node = selectByNodeId(nodeId)({ queryNodes: state });
      if (node) {
        node.junctionOperator = node.junctionOperator === '$and' ? '$or' : '$and';
        queryNodeAdapter.updateOne(state, { id: nodeId, changes: node });
      }
    },
    updateNodeExpression: (state, action) => {
      const { nodeId, expression } = action.payload;
      const node = selectByNodeId(nodeId)({ queryNodes: state });
      if (node) {
        node.expression = expression;
      }
    },
    addRootNode: (state, action) => {
      const { expression } = action.payload;

      const newQueryNode = {
        nodeId: '0',
        expression,
        junctionOperator: null,
        parentNodeId: '0',
      };
      queryNodeAdapter.addOne(state, newQueryNode as QueryNode);
    },
    appendNode: (state, action) => {
      // TODO - revise code to use partial whatever, such that node ID is not
      //        being passed in.  Its not being used and serves only to cause confusion.
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
          parentNode.junctionOperator = '$and';
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
    // updateQueryNode: queryNodeAdapter.updateOne,
    // removeManyQueryNodes: queryNodeAdapter.removeMany,
    removeNode: (state, action) => {
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
            parent.expression = Object.assign({}, siblingNode.expression);
            parent.junctionOperator = null;
            parent.expression.nodeId = parent.nodeId;
          }
        }
      }
      queryNodeAdapter.removeMany(state, nodesToBeRemoved);
    },
  },
});
export default queryNodeSlice;

const store = configureStore({
  reducer: {
    queryNodes: queryNodeSlice.reducer,
  },
});
// Want to figure out how to do this.
// Also doing the same thing in store/index.
// doing in both places can't be correct.
type RootState = ReturnType<typeof store.getState>;

export const {
  addRootNode,
  appendNode,
  removeNode,
  toggleJunctionOperator,
  updateNodeExpression,
} = queryNodeSlice.actions;

const TheSelectors = queryNodeAdapter.getSelectors<RootState>(
  (state) => state.queryNodes
);

// ------------------------ Selectors
export const selectByNodeId = (nodeId: string) => {
  return (state: RootState) => TheSelectors.selectById(state, nodeId);
};
export const selectExpressionByNodeId = (nodeId: string) => {
  return (state: RootState) => {
    return TheSelectors.selectById(state, nodeId)?.expression || null;
  }
};
export const selectChildrenIdsOf = (nodeId: string) => {
  const childRegExp = RegExp(`^${nodeId}:[\\d]+$`);
  return (state: RootState) => {
    // return state.queryNodes.ids;
    return state.queryNodes.ids.filter((childId) => {
      return (childId as string).match(childRegExp);
    });
  }; // TheSelectors.selectById(state, nodeId);
};
export const selectSiblingIdsOf = (nodeId: string) => {
  const parentId = nodeId.split(':').slice(0, -1).join(':');
  const childRegExp = RegExp(`^${parentId}:[\\d]+$`);
  return (state: RootState) => {
    // return state.queryNodes.ids;
    return state.queryNodes.ids.filter((childId) => {
      return (childId as string).match(childRegExp) && childId !== nodeId;
    });
  }; // TheSelectors.selectById(state, nodeId);
};
