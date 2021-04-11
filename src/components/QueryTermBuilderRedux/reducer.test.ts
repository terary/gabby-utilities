import queryNodeSlice, {
  QueryNode,
  appendNode,
  removeNode,
  selectByNodeId,
  selectSiblingIdsOf,
  selectChildrenIdsOf,
} from './slice';
import { QueryTermExpression } from '../QueryTermBuilder/types';

const reducer = queryNodeSlice.reducer;

// nodeId: childNodeId,
// operator: '$eq',
// value: `my parent is: ${thisQueryNode?.nodeId} and my value is: ` + Math.random(),
// subjectId: 'field003',
// dataType: 'text' as InputDataType,

// const reducer = queryNodeSlice.reducer;
// nodeId: string;
// expression: QueryTermExpression | null;
// junctionOperator: '$and' | '$or' | null;
// // isLeaf = junctionOperator === null
// // isBranch junctionOperator !== null
// // if(isBranch) -> expression = null
// // nodeExpression: QueryTermExpression | QueryBranchExpression;
// parentNodeId: string;

const queryTermExpressionLt: QueryTermExpression = {
  nodeId: '0',
  operator: '$lt',
  value: 'Test Root Node',
  subjectId: 'test-subjectId',
  dataType: 'text',
};
const queryTermExpressionEq: QueryTermExpression = {
  nodeId: '0',
  operator: '$eq',
  value: 'Test Root Node',
  subjectId: 'test-subjectId',
  dataType: 'text',
};

const rootNode: QueryNode = {
  nodeId: '0',
  parentNodeId: '0',
  expression: queryTermExpressionLt,
  junctionOperator: null,
};
const node00: QueryNode = {
  nodeId: '0:0',
  parentNodeId: '0',
  expression: { ...queryTermExpressionLt, ...{ nodeId: '0:0' } },
  junctionOperator: null,
};
const node01: QueryNode = {
  nodeId: '0:1',
  parentNodeId: '0',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1' } },
  junctionOperator: null,
};
const node02: QueryNode = {
  nodeId: '0:2',
  parentNodeId: '0',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:2' } },
  junctionOperator: null,
};
const node010: QueryNode = {
  nodeId: '0:1:0',
  parentNodeId: '0:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:0' } },
  junctionOperator: null,
};
const node011: QueryNode = {
  nodeId: '0:1:1',
  parentNodeId: '0:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:1'} },
  junctionOperator: null,
};
const node012: QueryNode = {
  nodeId: '0:1:2',
  parentNodeId: '0:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:2'} },
  junctionOperator: null,
};
const node0110: QueryNode = {
  nodeId: '0:1:1:0',
  parentNodeId: '0:1:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:1:0'} },
  junctionOperator: null,
};
const node0111: QueryNode = {
  nodeId: '0:1:1:1',
  parentNodeId: '0:1:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:1:1'} },
  junctionOperator: null,
};

const emptyState = {
  entities: {},
  ids: [],
};
const stateRootAndTwoLeafs = {
  entities: {
    '0': rootNode,
    '0:0': node00,
    '0:1': node01,
  },
  ids: ['0', '0:0', '0:1'],
};
const stateRootAndThreeLeafs = {
  entities: {
    '0': rootNode,
    '0:0': node00,
    '0:1': node01,
    '0:2': node02,
  },
  ids: ['0', '0:0', '0:1', '0:2'],
};
const stateWithGrandChildren = {
  entities: {
    '0': rootNode,
    '0:0': node00,
    '0:1': node01,
    '0:1:0': node010,
    '0:1:1': node011,
    '0:1:1:0': node0110,
    '0:1:1:1': node0111,
    '0:1:2': node012,
    '0:2': node02,
  },
  ids: ['0', '0:0', '0:1', '0:1:0', '0:1:1', '0:1:1:0', '0:1:1:1', '0:1:2', '0:2'],
};

describe('QueryTermBuilder Reducer', () => {
  it('Should return empty state when state is empty and applying non-action', () => {
    expect(reducer(undefined, { type: 'NON_ACTION_TYPE' })).toEqual({
      entities: {},
      ids: [],
    });
  });
  describe('Add Node', () => {
    it.skip('When adding expression to root (first expression) should not add leafs', () => {});
    it('Should create/add two leafs when adding to leaf, promoting leaf to branch (Root)', () => {
      expect(reducer(emptyState, appendNode(rootNode))).toEqual({
        entities: {
          '0:0': {
            expression: { nodeId: '0:0' },
            junctionOperator: null,
            nodeId: '0:0',
            parentNodeId: '0',
          },
          '0:1': {
            expression: { ...queryTermExpressionLt, ...{ nodeId: '0:1' } },
            junctionOperator: null,
            nodeId: '0:1',
            parentNodeId: '0',
          }
        },
        ids: ['0:0', '0:1'],
      });
    });
    it('Should add single leaf to branch, that has leafs', () => {
      expect(reducer(emptyState, appendNode(rootNode))).toEqual({
        entities: {
          '0:0': {
            expression: { nodeId: '0:0' },
            junctionOperator: null,
            nodeId: '0:0',
            parentNodeId: '0',
          },
          '0:1': {
            expression: { ...queryTermExpressionLt, ...{ nodeId: '0:1' } },
            junctionOperator: null,
            nodeId: '0:1',
            parentNodeId: '0',
          }
        },
        ids: ['0:0', '0:1'],
      });
    });
    it('Should create/add two leafs when adding to leaf, promoting leaf to branch #', () => {
      expect(reducer(stateRootAndTwoLeafs, appendNode(node02))).toEqual(
        stateRootAndThreeLeafs
      );
    });
  }); // describe('Add Node', ....
  describe('Remove Node', () => {
    it('Should remove single leaf from branch when 3 or more leafs on the branch', () => {
      expect(reducer(stateRootAndThreeLeafs, removeNode('0:2'))).toEqual(
        stateRootAndTwoLeafs
      );
    });
    it("Should remove all children when removing a branch, elevating last child's expression to parents expression", () => {
      const parentsNewExpression = {
        ...stateRootAndTwoLeafs.entities['0:0'].expression,
        ...{ nodeId: '0' },
      };

      expect(reducer(stateRootAndTwoLeafs, removeNode('0:1'))).toEqual({
        entities: {
          '0': { ...rootNode, ...{ expression: parentsNewExpression } },
        },
        ids: ['0'],
      });
    });
    it.skip('When removing branch should remove all children', () => {});
  }); // describe('Remove Node'
}); // QueryTermBuilder Reducer
describe('Selectors', () => {
  it('selectSiblingIdsOf,', () => {
    // with siblings
    expect(
      selectSiblingIdsOf('0:1:0')({ queryNodes: stateWithGrandChildren })
    ).toStrictEqual(['0:1:1', '0:1:2']);

    // without siblings
    expect(
      selectSiblingIdsOf('0')({ queryNodes: stateWithGrandChildren })
    ).toStrictEqual([]);

    // const stateWithGrandChildren = {
    //   entities: {
    //     '0': rootNode,
    //     '0:0': node00,
    //     '0:1': node01,
    //     '0:1:0': node010,
    //     '0:1:1': node011,
    //     '0:1:1:0': node0110,
    //     '0:1:1:1': node0111,
    //     '0:1:2': node012,
    //     '0:2': node02,
    //   },
  });
  it('selectByNodeId,', () => {
    // will find
    expect(selectByNodeId('0:1:1')({ queryNodes: stateWithGrandChildren })).toEqual(
      node011
    );

    // will not find
    expect(
      selectByNodeId('NOT_A_NODE_ID')({ queryNodes: stateWithGrandChildren })
    ).toBeUndefined();
  });
  it('selectChildrenIdsOf,', () => {

    // with children
    expect(
      selectChildrenIdsOf('0:1:1')({ queryNodes: stateWithGrandChildren })
    ).toStrictEqual(['0:1:1:0', '0:1:1:1']);

    // without children
    expect(
      selectChildrenIdsOf('0:0')({ queryNodes: stateWithGrandChildren })
    ).toStrictEqual([]);
  });
});
test.skip("Does order of state.ids matter? For layout purposes? I think it doesn't matter but needs to be consistent", () => {});
