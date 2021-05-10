import { useDispatch } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import { useQEUtils } from './hooks';
import { useStyles } from './styles';
import { QueryTermExpression, TermSubjectCollection } from '../QueryTermBuilder/types';

import { removeNode, appendNode, openForEdit } from './slice';

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

const noopOnFinish = () => {};

interface ButtonBarProps {
  nodeId: string;
  subjects: TermSubjectCollection;
  onFinish?: () => void;
}

export const ButtonBar = ({
  onFinish = noopOnFinish,
  nodeId,
  subjects,
}: ButtonBarProps) => {
  const { nodeSelector } = useQEUtils(nodeId);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleEditToggle = () => {
    dispatch(openForEdit({ nodeId, isOpenForEdit: !!!nodeSelector?.isOpenForEdit }));
  };
  const handleRemoveMe = () => {
    dispatch(removeNode(nodeId));
  };
  const handleAddChild = () => {
    dispatch(
      appendNode({
        parentNodeId: nodeId,
        expression: makeEmptyExpression(subjects),
      })
    );
  };

  const handleFinish = () => {
    onFinish();
    handleEditToggle();
  };

  return (
    <div className={classes.termItemButtonBar}>
      {nodeSelector?.isOpenForEdit && (
        <IconButton size="small" onClick={handleFinish} aria-label="Edit">
          <DoneIcon />
        </IconButton>
      )}
      {!nodeSelector?.isOpenForEdit && (
        <IconButton size="small" onClick={handleEditToggle} aria-label="Edit">
          <EditIcon />
        </IconButton>
      )}
      <IconButton size="small" onClick={handleRemoveMe} aria-label="Remove">
        <DeleteIcon />
      </IconButton>
      <IconButton size="small" onClick={handleAddChild} aria-label="Add">
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};
