import React from 'react';
import { Typography } from '@material-ui/core';
import useStyle from './ActivationConfirm';

function RegisterConfirmation() {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h6" align="center">
        You registred to Matcha!
      </Typography>
      <Typography variant="subtitle1" align="center">
        To follow the white rabbit in the glory hole,
        check your mails !
      </Typography>
    </div>
  );
}

export default RegisterConfirmation;
