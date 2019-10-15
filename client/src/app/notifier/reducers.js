import {
  ENQUEUE_SNACKBAR,
  REMOVE_SNACKBAR,
  CLOSE_SNACKBAR,
} from './actionTypes';

const initialState = {
  notifications: [],
};

function enqueueSnackbar(state, action) {
  const { key, notification } = action;
  return {
    ...state,
    notifications: [
      ...state.notifications,
      {
        key: key,
        ...notification,
      },
    ],
  };
}

function closeSnackbar(state, action) {
  return {
    ...state,
    notifications: state.notifications.map(notification => (
      (action.dismissAll || notification.key === action.key)
        ? { ...notification, dismissed: true }
        : { ...notification }
    )),
  };
}

function removeSnackbar(state, action) {
  return {
    ...state,
    notifications: state.notifications.filter(
      notification => notification.key !== action.key,
    ),
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ENQUEUE_SNACKBAR: return enqueueSnackbar(state, action);
    case CLOSE_SNACKBAR: return closeSnackbar(state, action);
    case REMOVE_SNACKBAR: return removeSnackbar(state, action);
    default: return state;
  }
}

export const getNofifications = state => state.alert.notifications;
