import React from 'react';
import { Link } from 'react-router-dom';
import { Favorite as LoveIcon } from '@material-ui/icons';
import { BadgedIconButton } from '../../../../shared/ui';

export default function VisitButton(props) {
  return (
    <Link to="/history/likes">
      <BadgedIconButton {...props}>
        <LoveIcon />
      </BadgedIconButton>
    </Link>
  );
}
