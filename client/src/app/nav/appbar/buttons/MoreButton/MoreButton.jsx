import React from 'react';
import { IconButton } from '@material-ui/core';
import { More as MoreIcon } from '@material-ui/icons';

export default function AccountButton(props) {
  const { className } = props;
  return (
    <IconButton className={className}>
      <MoreIcon />
    </IconButton>
  );
}
