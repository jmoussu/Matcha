import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Field, SubmitButton, Paper } from '../../shared/ui';

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5),
    margin: theme.spacing(1),
    boxSizing: 'border-box',
    maxWidth: '400px',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function BioForm({ fields, onSubmit }) {
  const classes = useStyle();
  return (
    <Paper className={classes.root}>
      <form
        onSubmit={onSubmit}
        className={classes.form}
      >
        <Field label="Bio" multiline rows={4} {...fields.bioField} />
        <SubmitButton>Save</SubmitButton>
      </form>
    </Paper>
  );
}
