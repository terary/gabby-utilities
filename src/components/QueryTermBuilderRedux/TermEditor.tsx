import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector, useDispatch } from 'react-redux';
import { QueryTermBuilder } from '../QueryTermBuilder';
// import { dbFields, operatorLabels } from '../../Sandboxes/dev-debug/debug-test-data';
import queryConfigManager, { QueryConfig } from '../../QueryConfigManager';

import { selectExpressionByNodeId, updateNodeExpression } from './slice';

const onChangeNoop = (term: any) => {};
interface TermViewerProps {
  nodeId: string;
  onChange?: (term: any) => void;
}


// TODO - rename this to TermEditor (inline with Ter)
export const TermEditor = ({ nodeId, onChange = onChangeNoop }: TermViewerProps) => {
  const dispatch = useDispatch();
  const [queryConfig, setQueryConfig] = useState({} as QueryConfig);
  const [isQueryConfigLoaded, setIsQueryConfigLoaded] = useState(false);
  const thisExpression = useSelector(selectExpressionByNodeId(nodeId));

  useEffect(() => {
    queryConfigManager('customers')
      .then((config) => {
        setQueryConfig(config);
        setIsQueryConfigLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleTermExpressionChange = (newTerm: any) => {
    onChange(newTerm);
    dispatch(updateNodeExpression({ nodeId, expression: newTerm }));
  };

  return (
    <>
      {isQueryConfigLoaded && thisExpression && (
        <QueryTermBuilder
          nodeId={nodeId}
          // operatorsWithLabels={operatorLabels}
          // querySubjects={dbFields}
          operatorsWithLabels={queryConfig.compareOperatorLabels}
          querySubjects={queryConfig.termSubjects}
          onExpressionChange={handleTermExpressionChange}
          initialQueryExpression={thisExpression || undefined}
        />
      )}
      {!isQueryConfigLoaded && <span>Loading...</span>}
    </>
  );
};
