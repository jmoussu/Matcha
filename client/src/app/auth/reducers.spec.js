import { expect } from 'chai';
import * as actions from './actionTypes';
import reducer from './reducers';

const initialState = {
  userId: '',
  token: '',
  expireIn: '',
  redirectTo: '',
  isAuth: false,
  isAuthenticating: false,
  error: '',
  justAuthenticated: false,
};

describe('Redux: Auth reducer', () => {
  it('return a state', () => {
    const state = reducer(undefined, {});
    expect(state).to.deep.equal(initialState);
  });
});
