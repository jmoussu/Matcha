import * as actions from './actionTypes';

const initialState = {
  userId: null,
  token: '',
  expireIn: '',
  redirectTo: '',
  isAuth: false,
  isAuthenticating: false,
  error: '',
  justAuthenticated: false,
  autoSignin: true,
};

function clearUserInfos() {
  return {
    userId: '',
    token: '',
    expireIn: '',
  };
}

function loginSuccess(state, action) {
  const { token: tkn, userId } = action.payload;
  return {
    ...state,
    isAuthenticating: false,
    justAuthenticated: true,
    isAuth: true,
    token: tkn,
    userId: userId,
    autoSignin: false,
  };
}

function loginFail(state, action) {
  const { error: err } = action.payload;
  const clearedUserInfos = clearUserInfos();
  return {
    ...state,
    ...clearedUserInfos,
    isAuthenticating: false,
    autoSignin: false,
    error: err,
  };
}

function loginStart(state) {
  const clearedUserInfos = clearUserInfos();
  return {
    ...state,
    ...clearedUserInfos,
    isAuthenticating: true,
    justAuthenticated: false,
    error: '',
    isAuth: false,
  };
}

function logout() {
  return initialState;
}

function registerSuccess(state) {
  return {
    ...state,
    isAuthenticating: false,
    justAuthenticated: true,
  };
}

function registerFail(state, action) {
  const { error: errorMsg } = action.payload;
  return {
    ...state,
    isAuthenticating: false,
    error: errorMsg,
  };
}

function registerStart(state) {
  return {
    ...state,
    isAuthenticating: true,
    justAuthenticated: false,
  };
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_START: return loginStart(state);
    case actions.LOGIN_SUCCESS: return loginSuccess(state, action);
    case actions.LOGIN_FAIL: return loginFail(state, action);
    case actions.LOGOUT: return logout();
    case actions.REGISTER_START: return registerStart(state);
    case actions.REGISTER_SUCCESS: return registerSuccess(state);
    case actions.REGISTER_FAIL: return registerFail(state, action);
    default: return state;
  }
}

export default reducer;

export const selectors = {
  getUserId: state => state.auth.userId,
};
