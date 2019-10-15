import * as actions from './actionTypes';

const initialState = {
  tags: [],
};

const fetchTagsSuccess = (state, action) => ({
  ...state,
  tags: action.payload,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_APP_TAGS: return state;
    case actions.FETCH_APP_TAGS_SUCCESS: return fetchTagsSuccess(state, action);
    default: return state;
  }
}

const getAllTags = state => state.app.tags;

export const selectors = {
  getAllTags,
};
