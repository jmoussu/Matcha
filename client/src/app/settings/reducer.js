import * as actions from './actionTypes';

const initialState = {
  account: {
    email: '',
    firstname: '',
    lastname: '',
    age: 20,
    gender: '',
  },
  searchPreferences: {
    male: null,
    female: null,
    other: null,
  },
  profile: {
    bio: null,
    tags: [],
    pics: [],
    score: null,
  },
  updating: {
    account: false,
    searchPreferences: false,
    profile: false,
    password: false,
    bio: false,
    tags: false,
    images: false,
  },
  citySuggestions: [],
};

const setAccountSettings = (state, action) => ({
  ...state,
  account: action.payload,
});

const setSearchPref = (state, action) => ({
  ...state,
  searchPreferences: action.payload,
});

const setProfile = (state, action) => ({
  ...state,
  profile: action.payload,
});

const setUserTags = (state, action) => ({
  ...state,
  profile: {
    ...state.profile,
    tags: action.payload,
  },
});

const updateItemStart = (state, item) => ({
  ...state,
  updating: {
    ...state.updating,
    [item]: true,
  },
});

const updateItemSuccess = (state, name) => ({
  ...state,
  updating: {
    ...state.updating,
    [name]: false,
  },
});

const setImages = (state, action) => ({
  ...state,
  profile: {
    ...state.profile,
    pics: action.payload,
  },
});

const updateAccountSettingsSuccess = state => updateItemSuccess(state, 'account');
const updateProfileSuccess = state => updateItemSuccess(state, 'profile');
const updateSearchPreferencesSuccess = state => updateItemSuccess(state, 'searchPreferences');
const updatePasswordSuccess = state => ({
  ...state,
  updating: {
    ...state.updating,
    password: false,
  },
});

const updateBioSuccess = (state, action) => ({
  ...state,
  profile: {
    ...state.profile,
    bio: action.payload.bio,
  },
});

const setCitySuggestions = (state, action) => ({
  ...state,
  citySuggestions: action.payload,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPDATE_PASSWORD: return updateItemStart(state, 'password');
    case actions.UPDATE_PASSWORD_SUCCESS: return updatePasswordSuccess(state);
    case actions.UPDATE_PASSWORD_FAIL: return state;

    case actions.SET_PROFILE_SETTINGS: return setProfile(state, action);
    case actions.UPDATE_PROFILE: return updateItemStart(state, 'profile');
    case actions.UPDATE_PROFILE_SUCCESS: return updateProfileSuccess(state);

    case actions.SET_ACCOUNT_SETTINGS: return setAccountSettings(state, action);
    case actions.UPDATE_ACCOUNT_SETTINGS: return updateItemStart(state, 'account');
    case actions.UPDATE_ACCOUNT_SETTINGS_SUCCESS: return updateAccountSettingsSuccess(state);

    case actions.SET_SEARCH_PREFERENCES: return setSearchPref(state, action);
    case actions.UPDATE_SEARCH_PREF: return updateItemStart(state, 'searchPreferences');
    case actions.UPDATE_SEARCH_PREF_SUCCESS: return updateSearchPreferencesSuccess(state);

    case actions.SET_USER_TAGS: return setUserTags(state, action);
    case actions.CREATE_TAG: return state;
    case actions.CREATE_TAG_SUCCESS: return state;
    case actions.CREATE_TAG_FAIL: return state;

    case actions.DELETE_TAG: return state;
    case actions.DELETE_TAG_SUCCESS: return state;
    case actions.DELETE_TAG_FAIL: return state;

    case actions.UPDATE_BIO: return state;
    case actions.UPDATE_BIO_SUCCESS: return updateBioSuccess(state, action);

    case actions.SET_IMAGES: return setImages(state, action);
    case actions.FETCH_CITY_SUGGESTION: return state;
    case actions.SET_SUGGESTIONS: return setCitySuggestions(state, action);
    default: return state;
  }
}

const getSearch = state => state.settings.searchPreferences;
const getAccount = state => state.settings.account;
const getProfile = state => state.settings.profile;
const isUpdatingAccount = state => state.settings.updating.account;
const isUpdatingSearchPref = state => state.settings.updating.searchPreferences;
const isUpdatingProfile = state => state.settings.updating.profile;
const isUpdatingPassword = state => state.settings.updating.password;
const getUserTags = state => state.settings.profile.tags;
const getUserImages = state => state.settings.profile.pics;
const userCanLike = state => state.settings.profile.pics.length;
const getGender = state => state.settings.account.gender;
const hasImages = state => state.settings.profile.pics.length > 0;
const getCities = state => state.settings.citySuggestions;

export const selectors = {
  getSearch,
  getAccount,
  getProfile,
  isUpdatingAccount,
  isUpdatingProfile,
  isUpdatingSearchPref,
  isUpdatingPassword,
  getUserTags,
  getUserImages,
  userCanLike,
  getGender,
  hasImages,
  getCities,
};
