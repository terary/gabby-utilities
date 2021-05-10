import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { ButtonBar } from './ButtonBar';
import { TermViewer2 } from './TermViewer2';
import { useQEUtils } from './hooks';
// import { TermEditor2 } from './TermEditor2';
import { QELabelMaker } from './types';
import {
  QueryTermExpression,
  TermOperatorLabelCollection,
  TermSubjectCollection,
} from '../QueryTermBuilder/types';

import {
  selectByNodeId,
  removeNode,
  appendNode,
  selectChildrenIdsOf,
  toggleJunctionOperator,
//  updateNodeExpression,
  openForEdit,
} from './slice';

import { JunctionSwitch } from './JunctionSwitch';

import { InputDataType } from '../common.types';
// import { TermEditor } from './TermEditor.tsx';
import { Grid, IconButton } from '@material-ui/core';
import { QueryBuilder } from '@material-ui/icons';
// import { QueryTermBuilderRedux } from './QueryTermBuilderRedux';
import { TermEditor2 } from './TermEditor2';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      border: '1px black solid',
      borderRadius: '5px',
      // margin: 5,
    },
    gridItem: {
      border: '1px grey solid',
      borderRadius: '25px',
      // margin: theme.spacing(1),
      // padding: '20px',
      // margin: '20px',
    },
    termItem : {

    },
    termItemText : {
      display: 'inline-block',
    },
    termItemButtonBar : {
      display: 'inline-block',
      float: 'right',
    },
    branch: {

    },

    branchContainer: {
      flexGrow: 1,
      border: '1px black solid',
      borderRadius: '5px',
      // margin: 5,
    },
    leafContainer: {
      border: '1px black solid',
      borderRadius: '5px',
      flexGrow: 1,
      // padding: theme.spacing(2),
      // margin:  '3px',
    },
    branchJunction: {

    },
    branchChildren: {
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

interface TermViewerProps {
  nodeId: string;
  opLabels: TermOperatorLabelCollection;
  subjects: TermSubjectCollection;
  labelMaker: QELabelMaker;
}

const makeEmptyExpression = (subjects: TermSubjectCollection): QueryTermExpression => {
  const firstSubject = Object.values(subjects)[0] || {};
  return {
    nodeId: 'gets assigned in reducer',
    operator: Object.values(firstSubject.queryOps)[0],
    value: null,
    subjectId: firstSubject.id,
    dataType: firstSubject.dataType,
  };
};

export const TermViewer = ({
  nodeId,
  opLabels,
  subjects,
  labelMaker,
}: TermViewerProps) => {
  const {nodeSelector, nodeCopy, expressionSelector, expressionCopy }  = useQEUtils(nodeId);
  const [showDebug, setShowDebug] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  // const thisQueryNode = useSelector(selectByNodeId(nodeId));
  // const [thisQueryNode, setThisQueryNode] = useState(
  //   useSelector(selectByNodeId(nodeId)) || { isOpenForEdit: false }
  // );
  const [thisQueryNode, setThisQueryNode] = useState(
    nodeCopy || { isOpenForEdit: false }
  );

  const [openTerm, setOpenTerm] = useState(null as QueryTermExpression | null);
  const childrenNodes = useSelector(selectChildrenIdsOf(nodeId)) || [];

  useEffect(() => {
    setThisQueryNode(nodeCopy || { isOpenForEdit: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  const handleRemoveMe = () => {
    dispatch(removeNode(nodeId));
  };

  const handleAddChild = () => {
    dispatch(
      appendNode({
        parentNodeId: nodeId,
        expression: makeEmptyExpression(subjects), // debugMakeFakeTermExpression('namelessChild'),
      })
    );
  };

  const bgColor = () => {
    if (isLeaf()) {
      return '#173F5F88';
    }
    return thisQueryNode?.junctionOperator === '$and' ? '#20639B88' : '#3CAEA288';
    // return '#20639B88';
  };
  const handleJunctionOpChange = () => {
    // toggleJunctionOperator
    dispatch(toggleJunctionOperator({ nodeId }));
  };

  const handleShowDebug = () => {
    setShowDebug(!showDebug);
  };

  const handleEditToggle = () => {
    // const x = Object.assign({}, thisQueryNode?.expression);
    // openTerm = Object.assign({}, thisQueryNode?.expression);
    // dispatch(openForEdit({ nodeId, isOpenForEdit: true }));
    dispatch(openForEdit({ nodeId, isOpenForEdit: !!!thisQueryNode?.isOpenForEdit }));

    // setIsOpenForEdit(!isOpenForEdit);
    // setOpenTerm(Object.assign({}, thisQueryNode?.expression));
    // eslint-disable-next-line prettier/prettier
    // would expect to update here
  };

  const BranchView = () => {
    return (
      <Grid
        container
        // spacing={3}
        className={classes.branchContainer}
        style={{ backgroundColor: bgColor() }}
      >
        <Grid item xs={12}>
          <JunctionSwitch
            onChange={handleJunctionOpChange}
            //@ts-ignore
            // junctionOperator={'$and'}
            junctionOperator={thisQueryNode.junctionOperator}
          />
          <IconButton size="small" onClick={handleAddChild} aria-label="Add">
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Grid
            direction="row"
            container
            spacing={3}
            // style={{ flexGrow: 1 }}
            // className={classes.branchChildren}
          >
            {childrenNodes.map((child, idx) => {
              return (
                <Grid item key={idx}>
                  <Paper elevation={3} className={classes.paper}>
                    <TermViewer
                      key={idx}
                      nodeId={child as string}
                      opLabels={opLabels}
                      subjects={subjects}
                      labelMaker={labelMaker}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  };
  const LeafView = () => {
    return (
      <>
        <div className={classes.termItemText}>
          {/* {thisQueryNode?.isOpenForEdit ? 'Open For Edit' : 'Closed For Edit'} */}
          {thisQueryNode?.isOpenForEdit && (
            <>
              <TermEditor2
                nodeId={nodeId}
                operatorsWithLabels={opLabels}
                querySubjects={subjects}
              />
            </>
          )}
          {!thisQueryNode?.isOpenForEdit && (
            <>
              <TermViewer2
                nodeId={nodeId}
                labelMaker={labelMaker}
                opLabels={opLabels}
                subjects={subjects}
              />
            </>
          )}
        </div>
      </>
    );
  };

  const isLeaf = () => {
    return childrenNodes.length === 0;
  };

  return (
    <>
      {/* {!thisQueryNode && (
        <span>
          {labelMaker(
            null,
            {} as TermSubjectCollection,
            {} as TermOperatorLabelCollection
          )}
        </span>
      )} */}
      {isLeaf() ? <LeafView key={nodeId} /> : <BranchView />}
    </>
  );
};
