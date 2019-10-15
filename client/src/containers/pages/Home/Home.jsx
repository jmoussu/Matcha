import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Logo } from '../../../app/shared/ui';

const useStyles = makeStyles(() => ({
  root : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function HomePage() {
  const classes = useStyles();
  // console.log('Bonjour a toi correcteur/trice !!');
  // console.log('Bienvenue sur notre matcha. La structure de notre site est directement inspire d une architecture DBS 3.2.');
  // console.log('Si tu souhaites avoir plus d infos n hesite pas a consulter cette video: https://www.youtube.com/watch?v=sgafChQEFIY');
  return (
    <div className={classes.root}>
      <Logo
        width="300px"
        color="#007FFD"
      />
      <Typography variant="h6">
        Theyre all going crazy !
      </Typography>
      <Link to="/login">
        <Button variant="contained">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="text">Register</Button>
      </Link>
    </div>
  );
}

export default HomePage;
