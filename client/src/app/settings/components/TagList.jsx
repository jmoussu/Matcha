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
  onDeleteTag,
}) {
  const classes = useStyles();

  // const [chipData, setChipData] = React.useState([
  //   { key: 0, label: 'Angular' },
  //   { key: 1, label: 'jQuery' },
  //   { key: 2, label: 'Polymer' },
  //   { key: 3, label: 'React' },
  //   { key: 4, label: 'Vue.js' },
  // ]);

  // const handleDelete = chipToDelete => () => {
  //   // setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  // };

  return (
    <div className={classes.root}>
      { tags.map((tagName) => {
        return (
          <Chip
            key={tagName}
            label={tagName}
            onDelete={() => onDeleteTag(tagName)}
            className={classes.chip}
          />
        );
      })}
    </div>
  );
}
