import React from 'react';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default function ImageUploader({ onFilesChoose }) {
  const classes = useStyles();

  return (
    <div>
      <input
        accept="image/*"
        className={classes.input}
        id="icon-button-file"
        type="file"
        onChange={e => onFilesChoose(e.target.files)}
      />
      <label htmlFor="icon-button-file">
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          component="span"
        >
          Upload
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>
      </label>
    </div>
  );
}
