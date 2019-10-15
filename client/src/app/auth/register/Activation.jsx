import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBox as CheckedIcon } from '@material-ui/icons';
import { Typography, makeStyles, Button } from '@material-ui/core';
import { baseApi } from '../../../axios-instances';
import { Paper } from '../../shared/ui';

const useStyle = makeStyles(theme => ({
  root: {
    width: '400px',
    margin: 'auto',
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 4),
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  icon: {
    fontSize: '150px',
  },
}));

export default function RegisterValidationPage(props) {
  const {
    match: {
      params: {
        token: tkn,
        email: mail,
      },
    },
    history,
  } = props;

  const [accountActive, setAccountActive] = useState(false);
  useEffect(() => {
    baseApi.post('/accounts/verif_registration_token', { email: mail }, {
      headers: { Authorization: `Bearer ${tkn}` },
    }).then(() => {
      setAccountActive(true);
    }).catch(
      (err) => {
        // console.log(err.response); // todo: remove in production
        history.replace('/error');
      },
    );
  }, [history, tkn, mail]);
  const classes = useStyle();

  const content = accountActive ? (
    <Paper className={classes.root}>
      <CheckedIcon className={classes.icon} />
      <Typography gutterBottom variant="h6" align="center">
        Account confirmed !
      </Typography>
      <Typography variant="subtitle1" align="center">
        {"Your adventure begins here. Let's start to Match !!"}
      </Typography>
      <Link to="/login">
        <Button
          color="primary"
          variant="outlined"
        >
          Back to login
        </Button>
      </Link>
    </Paper>
  ) : null;

  return content;
}
