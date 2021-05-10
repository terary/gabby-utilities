import pick from 'lodash.pick';
import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { QueryTermExpression } from '../QueryTermBuilder/types';

export type QueryNode = {
  // isLeaf = junctionOperator === null && expression != null
  // isBranch junctionOperator !== null && expression == null
  // nodeExpression: QueryTermExpression | QueryBranchExpression;
  nodeId: string;
  expression: QueryTermExpression | null;
  junctionOperator: '$and' | '$or' | null;
  parentNodeId: string;
  isOpenForEdit?: boolean;
};

const queryNodeAdapter = createEntityAdapter<QueryNode>({
  selectId: (queryNode: QueryNode) => queryNode.nodeId,
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
    loadSavedQueryExpression: (state, action) => {
      // should validity checks be done here? eg  has root. all children have parents
      // and parents exist (aka no orphans no detached branch)
      const { savedExpression } = action.payload;
      queryNodeAdapter.removeAll(state);
      Object.entries(savedExpression).forEach(([nodeId, node]) => {
        (node as QueryNode).isOpenForEdit = false;
        if (nodeId === '0') {
          queryNodeAdapter.addOne(state, node as QueryNode);
        } else {
          queryNodeAdapter.addOne(state, node as QueryNode);
        }
      });
    },
    openForEdit: (state, action) => {
      const { nodeId, isOpenForEdit } = action.payload;
      const node = selectByNodeId(nodeId)({ queryNodes: state });
      const x = Object.assign(node, { isOpenForEdit });
      // console.log(x);
      // if (node) {
      //   node.isOpenForEdit = isOpenForEdit;
      // }
      // queryNodeAdapter.updateOne(state, newQueryNode as QueryNode);
      //queryNodeAdapter.updateOne(state, { id: nodeId, changes: x });
    },
    updateNodeExpression: (state, action) => {
      const { nodeId, expression } = action.payload;
      const changeRequest = pick(expression, [
        'value',
        'operator',
        'subjectId',
        'dataType',
      ]) as QueryTermExpression;

      const node = { ...selectByNodeId(nodeId)({ queryNodes: state }) };
      if (!node) {
        return state;
      }
      node.expression = {
        ...node.expression,
        ...changeRequest,
      };
      queryNodeAdapter.updateOne(state, { id: nodeId, changes: node });
    },

    addRootNode: (state, action) => {
      const { expression } = action.payload;
      const node = selectByNodeId('0')({ queryNodes: state });
      if (node) {
        return state;
      }
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
      // there is a logic issue here.  If parent has children ['0:0','0:1', '0:2']
      // and removes '0:1' - this will overwrite '0:2'
      // maybe maxNum+1?
      let newChildNodeId = parentNodeId + ':' + parentsChildren.length;

      if (parentsChildren.length === 0) {
        newChildNodeId = parentNodeId + ':1';
        const parentNode = state.entities[parentNodeId];

        const promoteFirstChildPayload = {
          nodeId: parentNodeId + ':0',
          expression: { ...parentNode?.expression, ...{ nodeId: parentNodeId + ':0' } },
          junctionOperator: null,
          isOpenForEdit: false,
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
        isOpenForEdit: false,
        parentNodeId,
      };
      queryNodeAdapter.addOne(state, newQueryNode as QueryNode);
    },
    // updateQueryNode: queryNodeAdapter.updateOne,
    // removeManyQueryNodes: queryNodeAdapter.removeMany,

    removeNode: (state, action) => {
      const thisNodeId = action.payload;
      const mySiblings = selectSiblingIdsOf(thisNodeId)({ queryNodes: state });
      const nodesToBeRemoved = selectDescendantsIdsOf(thisNodeId)({
        queryNodes: state,
      });

      nodesToBeRemoved.push(thisNodeId);

      if (mySiblings.length === 1) {
        nodesToBeRemoved.push(mySiblings[0]);
        const siblingNode = state.entities[mySiblings[0]];
        const parent = state.entities[siblingNode?.parentNodeId || ''];

        if (parent && siblingNode) {
          // coverage complains this branch isn't tested.  To test
          // will required a flawed state - which *should* never be.
          parent.expression = Object.assign({}, siblingNode?.expression);
          parent.junctionOperator = null;
          parent.expression.nodeId = parent.nodeId;
        }
      }

      queryNodeAdapter.removeMany(state, nodesToBeRemoved);
    },
  },
});

export default queryNodeSlice;

// const store = configureStore({
//   reducer: {
//     queryNodes: queryNodeSlice.reducer,
//   },
// });
// Want to figure out how to do this.
// Also doing the same thing in store/index.
// doing in both places can't be correct.
// type RootState = ReturnType<typeof store.getState>;
type RootState = { queryNodes: EntityState<QueryNode> };
// https://redux.js.org/faq/code-structure
//  ^-- says preferred scaffolding put all things knowledgeable of state/slice
//  in same file - eg: actions, reduces selectors same file.
//  This particular file uses inter-dependant logic, reducer depends on some selectors
//  those selectors could be re-written to not be part of the exported selectors
//  since everything is in one file, not going to decouple.

export const {
  addRootNode,
  appendNode,
  removeNode,
  toggleJunctionOperator,
  updateNodeExpression,
  openForEdit,
  loadSavedQueryExpression,
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
  };
};
// export const selectExpressionByNodeId = (nodeId: string) => {
//   return (state: RootState) => {
//     return TheSelectors.selectById(state, nodeId)?.expression || null;
//   };
// };

export const selectChildrenIdsOf = (nodeId: string) => {
  const childRegExp = RegExp(`^${nodeId}:[\\d]+$`);
  return (state: RootState) => {
    return state.queryNodes.ids.filter((childId) => {
      return (childId as string).match(childRegExp);
    });
  }; // TheSelectors.selectById(state, nodeId);
};
const selectDescendantsIdsOf = (nodeId: string) => {
  const childRegExp = RegExp(`^${nodeId}:[\\d]+`);
  return (state: RootState) => {
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
