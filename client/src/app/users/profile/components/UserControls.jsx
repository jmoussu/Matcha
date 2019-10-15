import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import LoveIcon from '@material-ui/icons/Favorite';
import LoveIconEmpty from '@material-ui/icons/FavoriteBorder';
import { Chat as ChatIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  icon: {
    color: 'red',
    width: '60px',
    height: '60px',
  },
  iconDisabled: {
    color: 'grey',
    width: '60px',
    height: '60px',
  },
}));

export default function UserControls({
  canLove,
  onClickOnLove,
  canClick,
  profileId,
  canChat,
}) {
  const classes = useStyles();

  const loveBtn = canClick ? (
    <>
      <Tooltip title={canLove ? 'Try to math ?' : 'You already like !'}>
        <IconButton
          onClick={onClickOnLove}
          className={classes.button}
        >
          { canLove ? <LoveIconEmpty className={classes.icon} />
            : (
              <>
                <LoveIcon className={classes.icon} />
              </>
            )
          }
        </IconButton>
      </Tooltip>
      { canChat && (
        <Link to={`/chat/${profileId}`}>
          <IconButton>
            <ChatIcon className={classes.icon} />
          </IconButton>
        </Link>
      )}
    </>
  ) : (
    <IconButton
      className={classes.button}
      disabled
    >
      <LoveIcon className={classes.iconDisabled} />
    </IconButton>
  );

  return (
    <div>
      {loveBtn}
    </div>
  );
}
