import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SortResultButton({
  value,
  onChange,
}) {

  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="sorting-by">Sort By</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        inputProps={{
          name: 'sorting',
          id: 'sorting-by',
        }}
      >
        <MenuItem value="location">Location</MenuItem>
        <MenuItem value="age">Age</MenuItem>
        <MenuItem value="popularity">Popularity</MenuItem>
        <MenuItem value="tags">Tags</MenuItem>
      </Select>
    </FormControl>
  );
}
