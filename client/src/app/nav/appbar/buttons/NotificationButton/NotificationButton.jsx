import React from 'react';
import { Link } from 'react-router-dom';
import { Notifications as NotificationIcon } from '@material-ui/icons';
import { BadgedIconButton } from '../../../../shared/ui';

export default function AccountButton(props) {
  return (
    <Link to="/notifications">
      <BadgedIconButton {...props}>
        <NotificationIcon />
      </BadgedIconButton>
    </Link>
  );
}
