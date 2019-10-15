import { SET_ACCOUNT, CLEAR_ACCOUNT } from '../../app/actionTypes';

const initialState = {
  userID: null,
  email: null,
  firstname: null,
  lastname: null,
  gender: null,
  age: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_ACCOUNT: return { ...initialState };
    case SET_ACCOUNT: return { ...action.payload };
    default: return state;
  }
}
