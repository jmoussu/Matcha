import React from 'react';
import { IconButton, Badge } from '@material-ui/core';

export default function BadgedIconButton(props) {
  const {
    className,
    children,
    badgeProps,
    ...other
  } = props;
  return (
    <IconButton className={className} {...other}>
      <Badge {...badgeProps} color="secondary" variant="standard">
        {children}
      </Badge>
    </IconButton>
  );
}
