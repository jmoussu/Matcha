import * as Actions from './actionTypes';
import * as authService from './service';
import * as Alert from '../notifier/actions';
import settingsModule from '../settings';
import { actions as notifActions } from '../notifications';
import { Actions as chatActions } from '../chat';
//  from '../notifications';

// se desincrire de l evenement notification.

/* LOGIN ACTIONS */

function loginSuccess(tkn, userid) {
  return {
    type: Actions.LOGIN_SUCCESS,
    payload: {
      token: tkn,
      userId: userid,
    },
  };
}

function loginFail(data) {
  const { error: err } = data;
  return {
    type: Actions.LOGIN_FAIL,
    payload: {
      error: err,
    },
  };
}

const loginStart = () => ({ type: Actions.LOGIN_START });
export const login = formData => async (dispatch) => {
  const { email, password } = formData;
  dispatch(loginStart());
  try {
    const authInfos = await authService.login(email, password);
    const {
      token,
      userId,
      notifications,
      ...settings
    } = authInfos;
    dispatch(settingsModule.actions.setSettings(settings));
    dispatch(notifActions.subscribeOnNotifications());
    dispatch(notifActions.setNotifications(notifications));
    dispatch(chatActions.subscribeToMessageEvent());
    dispatch(loginSuccess(token, userId));
  } catch (err) {
    dispatch(Alert.alertError(err.message));
    dispatch(loginFail(err.message));
  }
};

export function logout() {
  authService.logout();
  return { type: Actions.LOGOUT };
}

/* REGISTER ACTIONS */


function registerSuccess() {
  return {
    type: Actions.REGISTER_SUCCESS,
  };
}

function registerFail(data) {
  return {
    type: Actions.REGISTER_FAIL,
    payload: data,
  };
}

const registerStart = () => ({ type: Actions.REGISTER_START });

export const register = formData => (dispatch) => {
  dispatch(registerStart());
  authService.register(formData).then(() => {
    dispatch(registerSuccess());
  }).catch(
    (err) => {
      dispatch(registerFail(err.response.data));
    },
  );
};


const autoSignSuccess = () => ({
  type: Actions.AUTO_SIGN_SUCCESS,
});

const autoSignFail = () => ({
  type: Actions.AUTO_SIGN_FAIL,
});

export const autoSign = token => async (dispatch) => {
  dispatch({ type: Actions.AUTO_SIGN });
  try {
    const accountInfos = await authService.signWithToken(token);
    const { token: newToken, notifications, userId, ...settings } = accountInfos;
    dispatch(settingsModule.actions.setSettings(settings));
    dispatch(autoSignSuccess());
    dispatch(notifActions.subscribeOnNotifications());
    dispatch(notifActions.setNotifications(notifications));
    dispatch(chatActions.subscribeToMessageEvent());
    dispatch(loginSuccess(newToken, userId));
  } catch (err) {
    dispatch(autoSignFail());
    localStorage.removeItem('token');
    // eslint-disable-next-line no-restricted-globals
    location.reload();
    // console.log(err.message);
  }
};
