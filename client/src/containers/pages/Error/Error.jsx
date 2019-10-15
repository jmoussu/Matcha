import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import SadLoveEmoticon from '../../../components/icons/NotFoundIcon/NotFoundIcon';
import { Paper } from '../../../app/shared/ui';

const useStyles = makeStyles(theme => ({
  root: {

  },
  content: {
    maxWidth: '388px',
    padding: theme.spacing(2, 4),
  },
  icon: {
    width: '100%',
  },
}));

export default function ErrorPage() {
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.content}>
        <SadLoveEmoticon className={classes.icon} />
        <Typography variant="h1" align="center">
          You fail
          <br />
          ...
        </Typography>
        {/* <img src="https://i.pinimg.com/originals/9d/35/51/9d355120d82b1592303e2a66b54ac02a.gif" alt="bitch" /> */}
        <Typography variant="subtitle1" align="center">
          {'this page no longer exists.'}
        </Typography>
      </Paper>
    </div>
  );
}
