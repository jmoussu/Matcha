import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { baseApiUrl } from '../../../../axios-instances';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));

const imageIsFeatured = idx => (idx === 0 || idx === 3);

export default function ImageList({ images }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={200} spacing={1} className={classes.gridList}>
        {images.map((tile, idx) => (
          <GridListTile key={tile.path} cols={imageIsFeatured(idx) ? 2 : 1} rows={imageIsFeatured(idx) ? 2 : 1}>
            <img src={`${baseApiUrl}/${tile.path}`} alt={tile.path} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
