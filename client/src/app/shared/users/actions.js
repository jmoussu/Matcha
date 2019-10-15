import { SET_ACCOUNT, CLEAR_ACCOUNT } from './actionTypes';

export function setAccount(accountInfos) {
  return {
    type: SET_ACCOUNT,
    payload: accountInfos,
  };
}

export function clearAccount() {
  return { type: CLEAR_ACCOUNT };
}
