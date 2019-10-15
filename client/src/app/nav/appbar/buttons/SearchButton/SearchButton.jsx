import React from 'react';
import { IconButton } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';

export default function AccountButton(props) {
  return (
    <Link to="/search">
      <IconButton {...props}>
        <SearchIcon />
      </IconButton>
    </Link>
  );
}
