import * as actions from './actionTypes';

const initialState = {
  profiles: [],
  sorting: 'age',
};

const sortByAge = (state) => {
  const newList = [...state.profiles].sort((a, b) => a.age - b.age);
  return {
    ...state,
    sorting: 'age',
    profiles: newList,
  };
};

const sortByPopularity = (state) => {
  const newList = [...state.profiles].sort((a, b) => b.score - a.score);
  return {
    ...state,
    sorting: 'popularity',
    profiles: newList,
  };
};

// todo
const sortByLocation = (state) => {
  const newList = [...state.profiles].sort((a, b) => a.location - b.location);
  return {
    ...state,
    sorting: 'location',
    profiles: newList,
  };
};

const sortByTags = (state) => {
  const newList = [...state.profiles].sort((a, b) => b.tags.length - a.tags.length);
  return {
    ...state,
    sorting: 'tags',
    profiles: newList,
  };
};

const fetchCustomSearchSuccess = (state, action) => {

  const newState = {
    ...state,
    profiles: action.payload,
  };
  switch (state.sorting) {
    case 'age': return sortByAge(newState);
    case 'popularity': return sortByPopularity(newState);
    case 'location': return sortByLocation(newState);
    case 'tags': return sortByTags(newState);
    default: return sortByAge(newState);
  }
};

const resetProfiles = state => ({
  ...state,
  profiles: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CUSTOM_SEARCH: return state;
    case actions.FETCH_CUSTOM_SEARCH_FAIL: return state;
    case actions.FETCH_CUSTOM_SEARCH_SUCCESS: return fetchCustomSearchSuccess(state, action);
    case actions.SORT_RESULT_BY_AGE: return sortByAge(state);
    case actions.SORT_RESULT_BY_LOCATION: return sortByLocation(state);
    case actions.SORT_RESULT_BY_POPULARITY: return sortByPopularity(state);
    case actions.SORT_RESULT_BY_TAG: return sortByTags(state);
    case actions.RESET_SEARCH_PROFILES: return resetProfiles(state);
    default: return state;
  }
}

export const selectors = {
  getProfiles: state => state.search.profiles,
};
