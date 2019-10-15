import * as actions from './actionTypes';
import socket from '../socket';
import { prepareBaseApiWithAuth } from '../../axios-instances';

export const subscribeOnNotifications = () => (dispatch, getState) => {
  dispatch({
    type: actions.SUBSCRIBE_TO_NOTIF,
  });
  socket.on('notification', (notif) => {
    const profileId = getState().users.profile.account.id;
    if (notif.id_give === profileId) {
      let hasLikedValue;
      if (notif.type === 1 || notif.type === 2) hasLikedValue = 1;
      if (notif.type === 3) hasLikedValue = 0;
      dispatch({ type: 'SET_PROFILE_HAS_LIKE', payload: hasLikedValue });
    }
    dispatch({
      type: actions.ADD_NOTIFICATION,
      payload: notif,
    });
  });
};

export const setNotifications = notifications => ({
  type: actions.SET_NOTIFICATIONS,
  payload: notifications,
});

export const markAllNotifAsRead = () => async (dispatch) => {
  const api = prepareBaseApiWithAuth();
  try {
    await api.post('/notifications/set_read');
  } catch (err) {
    // console.log('Correcteur tu es trop mignon/mignone');
  }
  dispatch({ type: actions.RESET_ALL_ACTIVE_NOTIFICATIONS });
};
