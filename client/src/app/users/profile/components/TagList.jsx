import React from 'react';
import { makeStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function TagList({
  tags,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { tags.map(tagName => (
        <Chip
          key={tagName}
          label={tagName}
          className={classes.chip}
        />
      ))}
    </div>
  );
}
