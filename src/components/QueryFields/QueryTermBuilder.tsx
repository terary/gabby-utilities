import { Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { QDebugDevSimple } from './QDebugDevSimple';

export const QueryTermBuilder = () => {
  const [thisQueryTerm, setThisQueryTerm] = useState({} as object | null);

  const handleQueryTermChange = (queryTerm: object | null) => {
    setThisQueryTerm(queryTerm);
  };

  return (
    <>
      <Paper elevation={3}>
        <QDebugDevSimple onChange={handleQueryTermChange} />
      </Paper>
      This Query Term: {JSON.stringify(thisQueryTerm)}
    </>
  );
};
