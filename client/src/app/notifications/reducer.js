import * as actions from './actionTypes';

const initialState = {
  notifications: [],
  count: 0,
};

const countActive = notifications => notifications.reduce(
  (counter, notif) => (notif.valide ? counter + 1 : counter), 0,
);

function resetActive(state) {
  const notifList = state.notifications.map(
    (notif) => {
      const newNotif = notif;
      newNotif.valide = 0;
      return newNotif;
    },
  );
  return {
    ...state,
    notifications: notifList,
    count: 0,
  };
}

function fetchNotifications(state, action) {
  return {
    ...state,
    notifications: action.payload,
  };
}

function addNotification(state, action) {
  const notification = action.payload;
  return {
    ...state,
    notifications: [notification, ...state.notifications],
    count: state.count + 1,
  };
}

function setNotifications(state, action) {
  return {
    ...state,
    notifications: action.payload,
    count: countActive(action.payload),
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_NOTIFICATIONS: return state;
    case actions.FETCH_NOTIFICATIONS_SUCCESS: return fetchNotifications(state, action);
    case actions.ADD_NOTIFICATION: return addNotification(state, action);
    case actions.SET_NOTIFICATIONS: return setNotifications(state, action);
    case actions.RESET_ALL_ACTIVE_NOTIFICATIONS: return resetActive(state);
    default: return state;
  }
}

export const selectors = {
  getNotifications: state => state.notif.notifications,
  countActiveNotifications: state => state.notif.count,
};
