import React from 'react';

import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  makeStyles,
} from '@material-ui/core';

import {
  Favorite as FavoriteIcon,
  RemoveRedEye as ViewIcon,
  FlashOn as MatchIcon,
  ThumbDown as BreakMatchIcon,
  Message as MessageIcon,
} from '@material-ui/icons';

import notifType from '../notificationType';

const useStyles = makeStyles(() => ({
  grey: {
    backgroundColor: 'grey',
  },
}));

function getInfosByType(type) {
  switch (type) {
    case notifType.VISITED: return {
      avatar: <ViewIcon />,
      msg: 'visited your profile !',
    };
    case notifType.LIKED: return {
      avatar: <FavoriteIcon />,
      msg: 'liked you !',
    };
    case notifType.MATCHED: return {
      avatar: <MatchIcon />,
      msg: 'matched with you !',
    };
    case notifType.BREAK_MATCH: return {
      avatar: <BreakMatchIcon />,
      msg: 'breaked love with you !',
    };
    case notifType.CHAT: return {
      avatar: <MessageIcon />,
      msg: 'sends you a message !',
    };
    default: throw new Error('no default switch');
  }
}

export default function Notification({
  type,
  fullname,
  url,
  onClick,
  active,
}) {
  const { avatar, msg } = getInfosByType(type);
  const classes = useStyles();
  return (
    <ListItem button onClick={onClick} className={active ? classes.grey : null}>
      <ListItemAvatar>
        <Avatar>
          {avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={fullname}
        secondary={msg}
      />
    </ListItem>
  );
}
