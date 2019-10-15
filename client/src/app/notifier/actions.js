import {
  ENQUEUE_SNACKBAR,
  REMOVE_SNACKBAR,
  CLOSE_SNACKBAR,
} from './actionTypes';

const defaultNotification = {
  options: {
    variant: 'success',
  },
  message: '',
};

export function enqueueSnackbar(notification = defaultNotification) {
  const key = notification.options && notification.options.key;
  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
}

export function closeSnackbar(key) {
  return {
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
  };
}

export function removeSnackbar(key) {
  return {
    type: REMOVE_SNACKBAR,
    key,
  };
}

export function alertError(message) {
  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      options: {
        variant: 'error',
      },
      message: message,
      key: new Date().getTime() + Math.random(),
    },
  };
}

export function alertSuccess(message) {
  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      options: {
        variant: 'success',
      },
      message: message,
      key: new Date().getTime() + Math.random(),
    },
  };
}
