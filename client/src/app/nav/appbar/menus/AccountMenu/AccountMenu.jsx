import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function AccountMenu({
  onClickItem,
  profileId,
  ...others
}) {
  return (
    <Menu {...others}>
      <Link to={`/users/${profileId}`}><MenuItem>Profile</MenuItem></Link>
      <Link onClick={onClickItem} to="/account"><MenuItem>Settings</MenuItem></Link>
      <Link to="/logout"><MenuItem>Logout</MenuItem></Link>
    </Menu>
  );
}
