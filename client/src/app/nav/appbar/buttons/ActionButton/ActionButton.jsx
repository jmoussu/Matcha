import React from 'react';
import { IconButton } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

export default function AccountButton(props) {
  return (
    <IconButton {...props}>
      <MenuIcon />
    </IconButton>
  );
}
