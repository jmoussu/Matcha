import React from 'react';
import { Link } from 'react-router-dom';
import { RemoveRedEye as ViewIcon } from '@material-ui/icons';
import { BadgedIconButton } from '../../../../shared/ui';

export default function VisitButton(props) {
  return (
    <Link to="/history/visits">
      <BadgedIconButton {...props}>
        <ViewIcon />
      </BadgedIconButton>
    </Link>
  );
}
