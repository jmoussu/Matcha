import React from 'react';
import { Paper as MuiPaper, useMediaQuery } from '@material-ui/core';

export default function Paper(props) {
  const {
    children, elevation, square,
    component, ...other
  } = props;
  const mobileLayout = useMediaQuery('(max-width:500px)');
  const content = mobileLayout
    ? <div {...other}>{children}</div>
    : (
      <MuiPaper
        elevation={elevation}
        square={square}
        component={component}
        {...other}
      >
        {children}
      </MuiPaper>
    );
  return content;
}
