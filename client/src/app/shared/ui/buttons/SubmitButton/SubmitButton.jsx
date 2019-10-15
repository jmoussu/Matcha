import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  '@keyframes rotateSync': {
    to: { transform: 'rotate(-360deg)' },
  },
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    animation: '$rotateSync 1s cubic-bezier(.79,.14,.15,.86) infinite',
  },
  iconSmall: {
    fontSize: 20,
  },
}));

export default function SubmitButton(props) {
  const { loading, children, ...other } = props;
  const classes = useStyles();

  return (
    <Button
      className={classes.button}
      {...other}
      type="submit"
    >
      {children}
      {loading && <SyncIcon className={clsx(classes.rightIcon, classes.iconSmall)} />}
    </Button>
  );
}
