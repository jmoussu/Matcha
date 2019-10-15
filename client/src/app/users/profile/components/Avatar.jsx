import React from 'react';
import {
  Badge,
  withStyles,
  Avatar as Avat,
  Box,
} from '@material-ui/core';

const StyledBadge2 = withStyles(theme => ({
  badge: {
    width: '12px',
    height: '12px',
    backgroundColor: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid #44b700',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

export default function Avatar({
  connected,
  src,
  alt,
}) {
  const avatar = src ? (
    <Avat
      alt={alt}
      src={src}
      style={{ width: '180px', height: '180px' }}
    />
  ) : (
    <Avat
      alt={alt}
      // src={src}
      style={{ width: '180px', height: '180px' }}
    >
      {alt}
    </Avat>
  );
  const content = connected ? (
    <StyledBadge2
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
    >
      {avatar}
    </StyledBadge2>
  ) : avatar;
  return (
    <Box m={1}>
      {content}
    </Box>
  );
}
