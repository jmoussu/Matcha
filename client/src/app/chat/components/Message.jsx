import React from 'react';
import {
  Avatar,
  makeStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

const useStyles = makeStyles({
  avatar: {
    margin: 10,
  },
  textRight: {
    textAlign: 'right',
  },
});

export default function Message({
  avatarUrl,
  body,
  self,
}) {
  const classes = useStyles();

  const msg = self ? (
    <ListItem>
      <ListItemText
        className={classes.textRight}
        secondary={body}
      />
    </ListItem>
  ) : (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          alt="Remy Sharp"
          src={avatarUrl}
          className={classes.avatar}
        />
      </ListItemAvatar>
      <ListItemText
        secondary={body}
      />
    </ListItem>
  );

  return msg;
}
