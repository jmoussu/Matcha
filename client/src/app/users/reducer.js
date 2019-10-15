import * as actions from './actionTypes';

const initialState = {
  profile: {
    account: {
      age: 0,
    },
    searchPreferences: null,
    profile: {
      pics: [],
    },
    liked: null,
    hasLiked: null,
    online: null,
  },
  fetched: false,
};

const setUserProfileInfos = (state, action) => ({
  ...state,
  profile: action.payload,
});

const fetchUserProfileSuccess = state => ({
  ...state,
  fetched: true,
});

const toggleLikeSuccess = (state, action) => ({
  ...state,
  profile: {
    ...state.profile,
    liked: action.payload.like,
  },
});

const setProfileHasLike = (state, action) => ({
  ...state,
  profile: {
    ...state.profile,
    hasLiked: action.payload,
  },
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_USER_PROFILE_INFOS: return state;
    case actions.FETCH_USER_PROFILE_INFOS_SUCCESS: return fetchUserProfileSuccess(state);
    case actions.FETCH_USER_PROFILE_INFOS_FAIL: return state;
    case actions.SET_USER_PROFILE_INFOS: return setUserProfileInfos(state, action);

    case actions.TOGGLE_LIKE_SUCCESS: return toggleLikeSuccess(state, action);
    case actions.MARK_PROFILE_AS_VISITED: return state;
    case actions.SET_PROFILE_HAS_LIKE: return setProfileHasLike(state, action);
    default: return state;
  }
}

export const selectors = {
  isUserDataFetched: state => state.users.fetched,
  getProfileInfos: state => state.users.profile,
  getProfileAvatar: state => state.users.profile.profile.pics.find(pic => pic.avatar),
  getProfileImages: state => state.users.profile.profile.pics.filter(pic => (pic.avatar === 0)),
  isUserLikeProfile: state => state.users.profile.liked,
  isProfileLikeUser: state => state.users.profile.hasLiked,
};
