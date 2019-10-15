import React from 'react';
import { Star } from '@material-ui/icons';
import { Badge } from '@material-ui/core';

export default function Score({ xp }) {
  return (
    <div title="popularity">
      <Badge
        badgeContent={xp}
        style={{ margin: '8px'}}
        max={500}
        color="primary"
      >
        <Star color="primary" style={{ width: '40px', height: '40px' }} />
      </Badge>
    </div>
  );
}
