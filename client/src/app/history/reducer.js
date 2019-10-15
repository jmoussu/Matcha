import * as actions from './actionTypes';

const initialState = {
  visitList: [],
  likeList: [],
};

const setVisits = (state, action) => ({
  ...state,
  visitList: action.payload,
});

const setLikes = (state, action) => ({
  ...state,
  likeList: action.payload,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_HISTORY_VISITS: return state;
    case actions.FETCH_HISTORY_VISITS_SUCCESS: return state;
    case actions.FETCH_HISTORY_VISITS_FAIL: return state;

    case actions.FETCH_HISTORY_LOVE: return state;
    case actions.FETCH_HISTORY_LOVE_SUCCESS: return state;
    case actions.FETCH_HISTORY_LOVE_FAIL: return state;

    case actions.SET_HISTORY_VISITS_LIST: return setVisits(state, action);
    case actions.SET_HISTORY_LOVE_LIST: return setLikes(state, action);
    default: return state;
  }
}

export const selectors = {
  getVisits: state => state.history.visitList,
  getLikes: state => state.history.likeList,
};
