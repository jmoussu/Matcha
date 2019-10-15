import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import { Face as FaceIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

export default function SearchPref({
  pref,
}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      { pref.female && (
        <Chip
          size="small"
          icon={<FaceIcon />}
          label="Search female"
          className={classes.chip}
          color="secondary"
        />
      )}
      { pref.male && (
        <Chip
          size="small"
          icon={<FaceIcon />}
          label="Search male"
          className={classes.chip}
          color="secondary"
        />
      )}
      { pref.other && (
        <Chip
          size="small"
          icon={<FaceIcon />}
          label="Search other people"
          className={classes.chip}
          color="secondary"
        />
      )}
    </div>
  );
}
