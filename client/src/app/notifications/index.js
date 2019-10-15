import { setNotifications, subscribeOnNotifications, markAllNotifAsRead } from './actions';

export { selectors } from './reducer';
export { default as NotificationsContainer } from './NotificationsContainer';
export { default as notifReducer } from './reducer';

export const actions = {
  setNotifications,
  subscribeOnNotifications,
  markAllNotifAsRead,
};
