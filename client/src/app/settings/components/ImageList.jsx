import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import {
  Close as CloseIcon,
  AccountCircle as AvatarIcon,
} from '@material-ui/icons';
import { baseApiUrl } from '../../../axios-instances';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 340,
    height: 450,
  },
  titleBar: {
    background: 'rgba(0,0,0,0.2)',
  },
  icon: {
    color: 'white',
  },
}));

export default function ImageList({
  onImageRemove,
  onImageSetAsAvatar,
  images,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList
        cellHeight={180}
        className={classes.gridList}
      >
        <GridListTile
          key="Subheader"
          cols={2}
          style={{ height: 'auto' }}
        >
          <ListSubheader component="div">Your pics</ListSubheader>
        </GridListTile>
        {images.sort((a, b) => (a.avatar === true ? 0 : 1)).map(tile => (
          <GridListTile
            key={tile.path}
          >
            <img src={`${baseApiUrl}/${tile.path}`} alt="bite" />
            <GridListTileBar
              className={classes.titleBar}
              titlePosition="top"
              actionPosition="right"
              title={tile.asAvatar ? 'Profile Picture' : ''}
              actionIcon={(
                <div>
                  { !tile.avatar && (
                  <IconButton
                    aria-label="info about me"
                    className={classes.icon}
                    onClick={() => onImageSetAsAvatar(tile.path)}
                  >
                    <AvatarIcon />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="info about me"
                    className={classes.icon}
                    onClick={() => onImageRemove(tile.path)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              )}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
