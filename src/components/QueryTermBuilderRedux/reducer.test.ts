import cloneDeep from 'lodash.clonedeep';
import queryNodeSlice, {
  QueryNode,
  appendNode,
  removeNode,
  selectByNodeId,
  selectSiblingIdsOf,
  selectChildrenIdsOf,
  loadSavedQueryExpression,
  toggleJunctionOperator,
  updateNodeExpression,
  addRootNode,
  selectExpressionByNodeId,
} from './slice';
import { QueryTermExpression } from '../QueryTermBuilder/types';
import { savedQueries } from '../../Sandboxes/dev-debug/saved-queries/index';
import { EntityState } from '@reduxjs/toolkit';
const reducer = queryNodeSlice.reducer;

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
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:1' } },
  junctionOperator: null,
};
const node012: QueryNode = {
  nodeId: '0:1:2',
  parentNodeId: '0:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:2' } },
  junctionOperator: null,
};

const node0110: QueryNode = {
  nodeId: '0:1:1:0',
  parentNodeId: '0:1:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:1:0' } },
  junctionOperator: null,
};

const node0111: QueryNode = {
  nodeId: '0:1:1:1',
  parentNodeId: '0:1:1',
  expression: { ...queryTermExpressionEq, ...{ nodeId: '0:1:1:1' } },
  junctionOperator: null,
};

const formatAsParent = (node: QueryNode, junctionOperator: '$and' | '$or') => {
  return {
    ...node,
    ...{ junctionOperator, expression: null },
  };
};

const emptyState = {
  entities: {},
  ids: [],
};
const _stateRootAndTwoLeaves = {
  entities: {
    '0': formatAsParent(rootNode, '$and'),
    '0:0': node00,
    '0:1': node01,
  },
  ids: ['0', '0:0', '0:1'],
};

const _stateRootAndThreeLeaves = {
  entities: {
    '0': formatAsParent(rootNode, '$and'),
    '0:0': node00,
    '0:1': node01,
    '0:2': node02,
  },
  ids: ['0', '0:0', '0:1', '0:2'],
};
const stateRootAndThreeLeaves = deepFreeze(cloneDeep(_stateRootAndThreeLeaves));

const _stateWithGrandChildren = {
  entities: {
    '0': formatAsParent(rootNode, '$and'),
    '0:0': node00,
    '0:1': formatAsParent(node01, '$or'),
    '0:1:0': node010,
    '0:1:1': formatAsParent(node011, '$and'),
    '0:1:1:0': node0110,
    '0:1:1:1': node0111,
    '0:1:2': node012,
    '0:2': node02,
  },
  ids: ['0', '0:0', '0:1', '0:1:0', '0:1:1', '0:1:1:0', '0:1:1:1', '0:1:2', '0:2'],
};
const stateWithGrandChildren = deepFreeze(cloneDeep(_stateWithGrandChildren));


describe('QueryTermBuilder Reducer', () => {
  let stateRootAndTwoLeaves: EntityState<QueryNode>; // { [nodeId: string]: QueryNode };
  beforeEach(() => {
    stateRootAndTwoLeaves = cloneDeep(_stateRootAndTwoLeaves);
  });
  it('Should return empty state when state is empty and applying non-action', () => {
    expect(reducer(undefined, { type: 'NON_ACTION_TYPE' })).toEqual({
      entities: {},
      ids: [],
    });
  });
  describe('Add Node', () => {
    let stateRootAndTwoLeaves: EntityState<QueryNode>; // { [nodeId: string]: QueryNode };
    beforeEach(() => {
      stateRootAndTwoLeaves = cloneDeep(_stateRootAndTwoLeaves);
    });
  
    it.skip('When adding expression to root (first expression) should not add leaves', () => {});
    it('Should create/add two leaves when adding to leaf, promoting leaf to branch (Root)', () => {
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
          },
        },
        ids: ['0:0', '0:1'],
      });
    });
    it('Should add single leaf if adding to branch', () => {
      const newQueryNode = {
        parentNodeId: '0',
        expression: queryTermExpressionLt,
      };
      const expectedState = stateRootAndTwoLeaves;
      const newState = reducer(_stateRootAndTwoLeaves, appendNode(newQueryNode));
      expectedState.entities['0:2'] = {
        expression: { ...queryTermExpressionLt, ...{ nodeId: '0:2' } },
        parentNodeId: '0',
        nodeId: '0:2',
        junctionOperator: null,
      };
      expectedState.ids.push('0:2');

      expect(newState).toEqual(expectedState);
    });
    it(`Should elevate existing leaf to branch and append to new branch. (
        ( new leaf +  existing leaf => 2 new leaves and 1 newish branch.)  `, () => {
      // when append to leaf, the leave will need to be elevated to branch, it's
      // expression added to new leaf, then append the target leaf to the new branch
      const newQueryNode = {
        parentNodeId: '0:1',
        expression: queryTermExpressionLt,
      };
      const expectedState = stateRootAndTwoLeaves;
      const newState = reducer(_stateRootAndTwoLeaves, appendNode(newQueryNode));

      // first child
      expectedState.entities['0:1:0'] = cloneDeep(
        _stateRootAndTwoLeaves.entities['0:1']
      );
      expectedState.entities['0:1:0'].nodeId = '0:1:0';
      expectedState.entities['0:1:0'].parentNodeId = '0:1';
      //@ts-ignore
      expectedState.entities['0:1:0'].expression.nodeId = '0:1:0';

      // new child
      expectedState.entities['0:1:1'] = {
        expression: { ...queryTermExpressionLt, ...{ nodeId: '0:1:1' } },
        parentNodeId: '0:1',
        nodeId: '0:1:1',
        junctionOperator: null,
      };

      // leaf becomes branch
      expect(expectedState.entities['0:1']).toBeTruthy();
      // otherwise ts complains about potential undefined
      if (!expectedState.entities['0:1']) {
        expectedState.entities['0:1'] = {} as QueryNode;
      }
      expectedState.entities['0:1'].expression = null;
      expectedState.entities['0:1'].junctionOperator = '$and';

      expectedState.ids.push('0:1:0', '0:1:1');

      expect(newState).toEqual(expectedState);
    });

    it('Should create/add two leafs when adding to leaf, promoting leaf to branch #', () => {
      expect(reducer(stateRootAndTwoLeaves, appendNode(node02))).toEqual(
        stateRootAndThreeLeaves
      );
    });
  }); // describe('Add Node', ....
  describe('removeNode', () => {
    it('Should remove single leaf if branch has 3 or more leaves', () => {
      expect(reducer(stateRootAndThreeLeaves, removeNode('0:2'))).toEqual(
        stateRootAndTwoLeaves
      );
    });
    it("Should remove both children when removing one of last two, parent will get remaining child's expression", () => {
      // if a branch has two children, removing one child will cause branch and last child to melb
      // that the branch become a leaf with expression of the remaining child

      const parentsNewExpression = {
        // ? because ts thinks it could be undefined
        ...stateRootAndTwoLeaves.entities['0:0']?.expression,
        ...{ nodeId: '0' },
      };

      expect(reducer(stateRootAndTwoLeaves, removeNode('0:1'))).toEqual({
        entities: {
          '0': { ...rootNode, ...{ expression: parentsNewExpression } },
        },
        ids: ['0'],
      });
    });
    it('Should remove all descendants when removing node', () => {
      const expectedState ={
        entities: {
          '0': formatAsParent(rootNode, '$and'),
          '0:0': node00,
          '0:2': node02,
        },
        ids: ['0', '0:0', '0:2'],
      };
      expect(reducer(stateWithGrandChildren, removeNode('0:1'))).toEqual(expectedState);
    });
  }); // describe('Remove Node'
  describe('toggleJunctionOperator', () => {
    it(`Should change junction operator from '$and' to '$or' `, () => {
      const expectedState = {
        entities: Object.assign({}, stateRootAndTwoLeaves.entities),
        ids: stateRootAndTwoLeaves.ids,
      };

      expectedState.entities['0'] = Object.assign(
        {},
        stateRootAndTwoLeaves.entities['0']
      );
      expectedState.entities['0'].junctionOperator = '$or';
      expect(
        reducer(stateRootAndTwoLeaves, toggleJunctionOperator({ nodeId: '0' }))
      ).toEqual(expectedState);
    });
    it('Should change junction operator', () => {
      const expectedState = {
        entities: Object.assign({}, stateRootAndTwoLeaves.entities),
        ids: stateRootAndTwoLeaves.ids,
      };

      expectedState.entities['0'] = Object.assign(
        {},
        stateRootAndTwoLeaves.entities['0']
      );
      expectedState.entities['0'].junctionOperator = '$and';

      // from $and (default) to $or
      const orState = reducer(
        stateRootAndTwoLeaves,
        toggleJunctionOperator({ nodeId: '0' })
      );

      expect(
        // from $or to $and
        reducer(orState, toggleJunctionOperator({ nodeId: '0' }))
      ).toEqual(expectedState);
    });

    it('Should make no changes if nodeId does not exist', () => {
      expect(
        reducer(
          stateRootAndTwoLeaves,
          toggleJunctionOperator({ nodeId: 'DOES NOT EXIST' })
        )
      ).toEqual(stateRootAndTwoLeaves);
    });
  });
  describe('addRootNode', () => {
    it('Should add root node', () => {
      expect(
        reducer(emptyState, addRootNode({ expression: queryTermExpressionLt }))
      ).toEqual({
        entities: {
          '0': {
            expression: queryTermExpressionLt,
            junctionOperator: null,
            nodeId: '0',
            parentNodeId: '0',
          }
        },
        ids: ['0'],
      });
    }); //it('Should add root node'
    it('Should not add root if one exists', () => {
      const stateRootAndTwoLeaves = cloneDeep(_stateRootAndTwoLeaves);

      //@ts-ignore
      stateRootAndTwoLeaves.entities['0'].expression = queryTermExpressionLt;

      const newState = reducer(
        _stateRootAndTwoLeaves,
        addRootNode({ expression: queryTermExpressionLt })
      );

      expect(newState).toEqual({
        entities: { ..._stateRootAndTwoLeaves.entities },
        ids: ['0', '0:0', '0:1'],
      });
      const newRootExpression = newState.entities['0']?.expression;
      const expectedRootExpression = _stateRootAndTwoLeaves.entities['0'].expression;
      const failedRootExpression = queryTermExpressionLt;
      expect(newRootExpression).toBe(expectedRootExpression);
      expect(newRootExpression).not.toBe(failedRootExpression);
    }); //it('Should not add root if one exists'
  }); // describe('addRootNode'
  describe('updateNodeExpression', () => {
    it('Should update Node appropriately', () => {
      const change = {
        value: 'new value',
        operator: '$betweenI',
        subjectId: 'someTestSubjectId',
        dataType: 'date',
      } as QueryTermExpression;

      const expectedState = cloneDeep(stateRootAndTwoLeaves);
      expect(expectedState.entities['0:1']).toBeTruthy();
      //@ts-ignore
      expectedState.entities['0:1'].expression = {
        //@ts-ignore
        ...expectedState.entities['0:1'].expression,
        ...change,
      };
      expect(
        reducer(
          stateRootAndTwoLeaves,
          updateNodeExpression({ nodeId: '0:1', expression: change })
        )
      ).toEqual(expectedState);
    });
    it('Should change only: value, operator, subjectId, dataType. ', () => {
      const change = {
        nodeId: 'something that exists but immutable',
        other: 'something that doesnt exist',
        value: 'new value',
        operator: '$betweenI',
        subjectId: 'someTestSubjectId',
        dataType: 'date',
      } as QueryTermExpression;

      const expectedState = cloneDeep(stateRootAndTwoLeaves);
      expect(stateRootAndTwoLeaves.entities['0:1']).not.toBeNull();
      //@ts-ignore
      expectedState.entities['0:1'].expression = {
        //@ts-ignore
        ...expectedState.entities['0:1'].expression,
        ...change,
        //@ts-ignore -- ts concerns it maybe null, tested above to be sure
        ...{ nodeId: stateRootAndTwoLeaves.entities['0:1'].expression.nodeId },
      };

      //@ts-ignore
      delete expectedState.entities['0:1'].expression.other;
      expect(
        reducer(
          stateRootAndTwoLeaves,
          updateNodeExpression({ nodeId: '0:1', expression: change })
        )
      ).toEqual(expectedState);
    }); // it('Should not update nodeId or parentId'
    it('Should make no changes if nodeId is not found ', () => {
      const change = {
        nodeId: 'something that exists but immutable',
        other: 'something that doesnt exist',
        value: 'new value',
        operator: '$betweenI',
        subjectId: 'someTestSubjectId',
        dataType: 'date',
      } as QueryTermExpression;

      const expectedState = cloneDeep(stateRootAndTwoLeaves);

      // either this or several ts-ignore
      expect(expectedState).toStrictEqual(stateRootAndTwoLeaves);
      if (!expectedState.entities['0:1']) {
        expectedState.entities['0:1'] = {} as QueryNode;
      }

      expectedState.entities['0:1'].expression = {
        ...expectedState.entities['0:1'].expression,
        ...change,
        //@ts-ignore -- ts concerns it maybe null, tested above to be sure
        ...{ nodeId: stateRootAndTwoLeaves.entities['0:1'].expression.nodeId },
      };

      //@ts-ignore
      delete expectedState.entities['0:1'].expression.other;
      expect(
        reducer(
          stateRootAndTwoLeaves,
          updateNodeExpression({ nodeId: 'DOES_NOT_EXIST', expression: change })
        )
      ).toEqual(stateRootAndTwoLeaves);
    }); // it('Should make no changes if nodeId is not found'
  });
  describe('loadSavedQueryExpression', () => {
    it('should remove existing and insert all new nodes', () => {
      expect(
        reducer(
          stateRootAndThreeLeaves,
          loadSavedQueryExpression({ savedExpression: savedQueries.branching })
        )
      ).toEqual({
        entities: savedQueries.branching,
        ids: [
          // generated by redux
          '0',
          '0:0',
          '0:0:0',
          '0:0:0:0',
          '0:0:0:1',
          '0:0:1',
          '0:0:1:0',
          '0:0:1:0:0',
          '0:0:1:0:1',
          '0:0:1:1',
          '0:1',
          '0:1:0',
          '0:1:1',
          '0:1:1:0',
          '0:1:1:1',
          '0:1:1:2',
          '0:1:1:3',
          '0:1:1:4',
        ],
      });
    }); // it('should remove existing insert all new nodes'
  }); //describe('loadSaved'
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
    expect(selectByNodeId('0:1:1:0')({ queryNodes: stateWithGrandChildren })).toEqual(
      node0110
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
  it('selectExpressionByNodeId, return expression if leaf', () => {
    // with children
    expect(
      selectExpressionByNodeId('0:1:1:1')({ queryNodes: stateWithGrandChildren })
    ).toStrictEqual(node0111.expression);
  });
  it('selectExpressionByNodeId, return null if branch', () => {
    // with children
    expect(
      selectExpressionByNodeId('0:1:1')({ queryNodes: stateWithGrandChildren })
    ).toBeNull();
  });
});

test.skip('need to make sure using deepFreeze and deepClone', () => {});

function deepFreeze(object: any) {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}
