import React from 'react';
// import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import { makeStyles } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Score from './Score';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  icons: {
    margin: theme.spacing(1),
    width: '40px',
    height: '40px',
  },
}));

export default function Stats({
  score,
  // visited,
  liked,
}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Score xp={score} className={classes.icons} />
      {/* { visited && <RemoveRedEyeIcon /> } */}
      { liked && (
      <div title="he/she likes you !">
        <FavoriteBorderIcon className={classes.icons} />
      </div>
      )}
    </div>
  );
}
