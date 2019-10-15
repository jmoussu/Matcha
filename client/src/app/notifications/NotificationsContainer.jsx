import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  List,
  makeStyles,
} from '@material-ui/core';
import { selectors } from './reducer';
import Notification from './components/Notification';
import { markAllNotifAsRead } from './actions';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    margin: 'auto',
  },
}));

function NotificationsContainer({
  notificationList,
  onMarkNotifAsRead,
  activeNotifCount,
  history,
}) {
  const classes = useStyles();

  useEffect(() => {
    if (activeNotifCount) onMarkNotifAsRead();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNotifCount]);

  const handleNotificationClick = (id) => {
    history.push(`/users/${id}`);
  };

  const notifications = notificationList.map(notif => (
    <Notification
      type={notif.type}
      fullname={notif.fullname}
      url={`/users/${notif.id_give}`}
      key={notif.id}
      onClick={() => handleNotificationClick(notif.id_give)}
      active={notif.valide}
    />
  ));

  return (
    <List className={classes.root}>
      {notifications}
    </List>
  );
}

const mapStateToProps = state => ({
  notificationList: selectors.getNotifications(state),
  activeNotifCount: selectors.countActiveNotifications(state),
});

const mapDispatchToProps = dispatch => ({
  onMarkNotifAsRead: () => dispatch(markAllNotifAsRead()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer);
