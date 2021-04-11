import store from '../../store';
import { queryNodeAdapter } from './slice';
import queryNodeSlice from './slice';
// const store = configureStore({
//   reducer: {
//     queryNodes: queryNodeSlice.reducer,
//   },
// });

// - move the byId selector from component to slice 
// - figure out the typing stuff, QueryNode QueryNodeCollection QueryNode[], nodeIds[] 
// - figure out a pattern - traverse nodeids - thisNode has children? this node expression - is Children
// -

export type RootState = ReturnType<typeof store.getState>;

// { ids: [], entities: {} }

// Can create a set of memoized selectors based on the location of this entity state
const queryNodesSelectors = queryNodeAdapter.getSelectors<RootState>(
  (state) => state.queryNodes
);

// And then use the selectors to retrieve values
// export const allQueryNodes = queryNodesSelectors.selectAll(store.getState());
export const allQueryNodes = queryNodesSelectors.selectAll(store.getState());
export const MyAwesomeAllSelector = queryNodesSelectors.selectAll;

// export const { bookAdded, booksLoading, booksReceived, bookUpdated } = queryNodeSlice.actions;
export const {
  queryNodeAdded,
  addChildToNode,
  addChildToNode2,
  updateQueryNode,
  removeManyQueryNodes,
  removeManyQueryNodes2,
  // promoteChild,
} = queryNodeSlice.actions;
export const TheSelectors = queryNodeAdapter.getSelectors<RootState>(
  (state) => state.queryNodes
);
// ------------------------
export const selectByNodeId = (nodeId: string) => {
  return (state: RootState) => TheSelectors.selectById(state, nodeId);
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
