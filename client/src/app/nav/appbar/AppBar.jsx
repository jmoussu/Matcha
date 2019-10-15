import React, { useState } from 'react';
import {
  AppBar as MuiAppBar, Toolbar,
  makeStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';

import AccountButton from './buttons/AccountButton/AccountButton';
import NotificationButton from './buttons/NotificationButton/NotificationButton';
import VisitButton from './buttons/VisitButton/VisitButton';
import AccountMenu from './menus/AccountMenu/AccountMenu';
import MatchButton from './buttons/MatchViewerButton/MatchViewerButton';
import SearchButton from './buttons/SearchButton/SearchButton';

import { selectors as notifSelectors } from '../../notifications';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  AccountBtn: {
    // flexGrow: 1,
  },
}));

function AppBar({
  auth,
  profileId,
  notifCounter,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = event => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleClickItem = () => setAnchorEl(null);

  return (
    <div className={classes.root}>
      <MuiAppBar position="static">
        <Toolbar>
          { auth && (
            <>
              <SearchButton />
              <MatchButton />
              <VisitButton className={classes.AccountBtn} />
              <NotificationButton
                className={classes.AccountBtn}
                badgeProps={{
                  badgeContent: notifCounter,
                }}
              />
              <div>
                <AccountButton
                  className={classes.AccountBtn}
                  onClick={(e) => { handleMenu(e); }}
                />
                <AccountMenu
                  onClick={handleClickItem}
                  open={!!anchorEl}
                  onClose={handleCloseMenu}
                  anchorEl={anchorEl}
                  profileId={profileId}
                />
              </div>
            </>
          )}
        </Toolbar>
      </MuiAppBar>
    </div>
  );
}

const mapStateToProps = state => ({
  profileId: state.auth.userId,
  notifCounter: notifSelectors.countActiveNotifications(state),
});

export default connect(mapStateToProps)(AppBar);
