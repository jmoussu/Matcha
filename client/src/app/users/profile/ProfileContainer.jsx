import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';

import TagList from './components/TagList';
import ImageList from './components/ImageList';
import Stats from './components/Stats';
import UserControls from './components/UserControls';
import Bio from './components/Bio';
import Avatar from './components/Avatar';
import TroubleButton from './components/TroubleButton';
import { selectors as UserSelectors } from '../reducer';
import {
  fetchUserProfileInfos,
  likeProfile,
  UnlikeProfile,
  ReportProfile,
} from '../actions';
import { baseApiUrl } from '../../../axios-instances';
import { selectors as authSelectors } from '../../auth';
import userSettings from '../../settings';
import shared from '../../shared';
import SearchPref from './components/searchPref';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  troubleBtn: {
    margin: theme.spacing(1),
  },
}));

function ProfileContainer({
  match: {
    params: {
      id: profileId,
    },
  },
  user,
  fetched,
  onFetchProfile,
  onLikeProfile,
  onUnlikeProfile,
  onReportProfile,
  avatar,
  images,
  liked,
  userId,
  canLike,
  match,
  profileLikeMe,
  profileAge,
}) {
  useEffect(() => {
    onFetchProfile(profileId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.url]);

  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const handleClickOnLove = () => {
    if (liked) onUnlikeProfile(profileId);
    else onLikeProfile(profileId);
  };

  const handleClickOnTrouble = (type) => {
    if (type === 'Block profile') {
      onReportProfile(profileId, 'block');
    } else if (type === 'Report profile') {
      // onReportProfile(profileId, 'fake');
      setModal(true);
    }
  };

  const getLastConnection = (sqlDate) => {
    const date = shared.utils.date.parseSqlDate(sqlDate);
    const formatDate = `${date.getDate()}/${date.getMonth()} at ${date.getHours() + 2}:${date.getMinutes()}`;
    return `last activity: ${formatDate}`;
  };

  const handleCloseModal = () => setModal(false);

  const reportModal = (
    <Dialog
      open={modal}
      onClose={handleCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Report confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {'You have (or already) reported this profile. Thanks for your supporrt.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Close this report
        </Button>
      </DialogActions>
    </Dialog>
  );

  const content = fetched ? (
    <div className={classes.root}>
      <Avatar
        alt={user.account.firstname.charAt(0).toUpperCase()}
        src={avatar ? `${baseApiUrl}/${avatar.path}` : null}
        connected={user.online}
      />
      <Typography variant="h6">{`${user.account.firstname}`}</Typography>
      <Typography variant="overline">{`${profileAge} years`}</Typography>
      <Typography variant="overline">{user.account.city}</Typography>
      { !user.online && (
        <Typography variabt="subtitle">
          {getLastConnection(user.account.last_visit)}
        </Typography>
      )}
      <SearchPref pref={user.searchPreferences} />
      <Stats
        score={user.profile.score}
        liked={user.profile.hasLiked}
      />
      <Typography variant="body2">
        {user.account.gender}
      </Typography>
      <TagList tags={user.profile.tags} />
      <Bio textContent={user.profile.bio} />
      { (userId !== parseInt(profileId, 10))
        && (
          <UserControls
            onClickOnLove={handleClickOnLove}
            canLove={!liked || false}
            canClick={canLike || false}
            canChat={(profileLikeMe && liked) || false}
            profileId={profileId}
          />
        )
      }
      { images.length > 0 && <ImageList images={images} />}
      { userId !== parseInt(profileId, 10)
        && <TroubleButton className={classes.troubleBtn} onClick={handleClickOnTrouble} />
      }
      { modal && reportModal

      }
    </div>
  ) : null;

  return content;
}

const mapStatetoProps = state => ({
  user: UserSelectors.getProfileInfos(state),
  fetched: UserSelectors.isUserDataFetched(state),
  avatar: UserSelectors.getProfileAvatar(state),
  images: UserSelectors.getProfileImages(state),
  liked: UserSelectors.isUserLikeProfile(state),
  profileLikeMe: UserSelectors.isProfileLikeUser(state),
  userId: authSelectors.getUserId(state),
  canLike: userSettings.selectors.userCanLike(state),
  profileAge: state.users.profile.account.age,
});

const mapDispatchToProps = dispatch => ({
  onFetchProfile: id => dispatch(fetchUserProfileInfos(id)),
  onLikeProfile: id => dispatch(likeProfile(id)),
  onUnlikeProfile: id => dispatch(UnlikeProfile(id)),
  onReportProfile: (id, type) => dispatch(ReportProfile(id, type)),
});

export default connect(mapStatetoProps, mapDispatchToProps)(ProfileContainer);
