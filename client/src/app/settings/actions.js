import * as actions from './actionTypes';
import * as service from './service';
import { alertError, alertSuccess } from '../notifier/index';
import axios from 'axios';
import { prepareBaseApiWithAuth } from '../../axios-instances';

const setAccountSettings = settings => ({
  type: actions.SET_ACCOUNT_SETTINGS,
  payload: settings,
});

const setProfileSettings = settings => ({
  type: actions.SET_PROFILE_SETTINGS,
  payload: settings,
});

const setSearchPreferences = pref => ({
  type: actions.SET_SEARCH_PREFERENCES,
  payload: pref,
});

const setSettings = settings => (dispatch) => {
  const { account, profile, searchPreferences } = settings;
  dispatch(setAccountSettings(account));
  dispatch(setProfileSettings(profile));
  dispatch(setSearchPreferences(searchPreferences));
};

const updateAccountSettings = settings => async (dispatch) => {
  dispatch({ type: actions.UPDATE_ACCOUNT_SETTINGS });
  try {
    await service.updateAccountSettings(settings);
    dispatch({ type: actions.UPDATE_ACCOUNT_SETTINGS_SUCCESS });
    dispatch(setAccountSettings(settings));
    dispatch(alertSuccess('Changes are saved.'));
  } catch (err) {
    dispatch({ type: actions.UPDATE_ACCOUNT_SETTINGS_FAIL });
    dispatch(alertError(err.message));
  }
};

const updateSearchPreferencesSuccess = searchPref => ({
  type: actions.UPDATE_SEARCH_PREF_SUCCESS,
  payload: searchPref,
});

const updateSearchPreferencesFail = () => ({
  type: actions.UPDATE_SEARCH_PREF_FAIL,
});

const updateSearchPreferences = searchPref => async (dispatch) => {
  dispatch({ type: actions.UPDATE_SEARCH_PREF });
  try {
    const newSearchPref = await service.updateSearchPreferences(searchPref);
    dispatch(setSearchPreferences(newSearchPref));
    dispatch(updateSearchPreferencesSuccess(newSearchPref));
    dispatch(alertSuccess('Changes are saved.'));
  } catch (err) {
    dispatch(updateSearchPreferencesFail());
    dispatch(alertError(err.message));
  }
};

const updatePassword = passInfos => async (dispatch) => {
  dispatch({ type: actions.UPDATE_PASSWORD });
  try {
    await service.updatePassword(passInfos);
    dispatch({ type: actions.UPDATE_PASSWORD_SUCCESS });
    dispatch(alertSuccess('Changes are saved.'));
  } catch (err) {
    dispatch({ type: actions.UPDATE_PASSWORD_FAIL });
    dispatch(alertError(err.message));
  }
};

const createTagSuccess = () => ({
  type: actions.CREATE_TAG_SUCCESS,
});

const createTagFail = () => ({
  type: actions.CREATE_TAG_FAIL,
});

const setUserTags = tags => ({
  type: actions.SET_USER_TAGS,
  payload: tags,
});

const createTag = tagValue => async (dispatch) => {
  dispatch({ type: actions.CREATE_TAG });
  try {
    const newTagList = await service.createTag({ tag: tagValue });
    dispatch(createTagSuccess());
    dispatch(setUserTags(newTagList));
    dispatch(alertSuccess('New tag created.'));
  } catch (err) {
    dispatch(createTagFail());
    dispatch(alertError(err.message));
  }
};

const deleteTagSuccess = () => ({
  type: actions.DELETE_TAG_SUCCESS,
});

const deleteTagFail = () => ({
  type: actions.DELETE_TAG_FAIL,
});

const deleteTag = tagValue => async (dispatch) => {
  dispatch({ type: actions.DELETE_TAG });
  try {
    const newTagList = await service.deleteTag({ tag: tagValue });
    dispatch(deleteTagSuccess());
    dispatch(setUserTags(newTagList));
    dispatch(alertSuccess('Tag was deleted.'));
  } catch (err) {
    dispatch(deleteTagFail());
    dispatch(alertError(err.message));
  }
};

const updateBioSuccess = updatedBio => ({
  type: actions.UPDATE_BIO_SUCCESS,
  payload: {
    bio: updatedBio,
  },
});

const updateBioFail = () => ({
  type: actions.UPDATE_BIO_FAIL,
});

const updateBio = bio => async (dispatch) => {
  dispatch({ type: actions.UPDATE_BIO });
  try {
    const newBio = await service.updateBio(bio);
    dispatch(updateBioSuccess(newBio.bio));
    dispatch(alertSuccess('Changes are saved.'));
  } catch (err) {
    dispatch(updateBioFail());
    dispatch(alertError(err.message));
  }
};

const setImages = imgList => ({
  type: actions.SET_IMAGES,
  payload: imgList,
});

const addImageSuccess = () => ({
  type: actions.ADD_IMAGE_SUCCESS,
});

const addImageFail = () => ({
  type: actions.ADD_IMAGE_FAIL,
});


const addImage = img => async (dispatch) => {
  dispatch({ type: actions.ADD_IMAGE });
  try {
    const newImgList = await service.uploadImage(img);
    dispatch(addImageSuccess());
    dispatch(setImages(newImgList));
    dispatch(alertSuccess('Changes are saved.'));
  } catch (err) {
    dispatch(addImageFail());
    dispatch(alertError(err.message));
  }
};

const removeImageSuccess = () => ({
  type: actions.REMOVE_IMAGE_SUCCESS,
});

const removeImageFail = () => ({
  type: actions.REMOVE_IMAGE_FAIL,
});

const removeImage = imgPath => async (dispatch) => {
  dispatch({ type: actions.REMOVE_IMAGE });
  try {
    const newImgList = await service.deleteImage(imgPath);
    dispatch(removeImageSuccess());
    dispatch(alertSuccess('Changes are saved.'));
    dispatch(setImages(newImgList));
  } catch (err) {
    dispatch(removeImageFail());
    dispatch(alertError(err.message));
  }
};

const setAvatarSuccess = () => ({
  type: actions.SET_AVATAR_SUCCESS,
});

const setAvatarFail = () => ({
  type: actions.SET_AVATAR_FAIL,
});

const setAvatar = imgPath => async (dispatch) => {
  dispatch({ type: actions.SET_AVATAR });
  try {
    const newImgList = await service.setAvatar(imgPath);
    dispatch(setAvatarSuccess());
    dispatch(setImages(newImgList));
    dispatch(alertSuccess('This image is your avatar now.'));
  } catch (err) {
    dispatch(setAvatarFail());
    dispatch(alertError(err.message));
  }
};

const fetchCitySuggestions = text => async (dispatch) => {
  try {
    const response = await axios.get(`https://geo.api.gouv.fr/communes?nom=${text}`);
    dispatch({
      type: actions.SET_SUGGESTIONS,
      payload: response.data,
    });
  } catch (err) {
    // console.log('dur maggle');
  }
};

const saveCity = cityName => async (dispatch) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${cityName}&country=france&format=json`);
    const { data } = response;
    // console.log(data);
    if (data.length > 0) {
      const { lat: latitude, lon: longitude } = data[0];
      const api = prepareBaseApiWithAuth();
      await api.post('/accounts/update/localisation', { latitude, longitude });
      dispatch(alertSuccess('location updated'));
    } else {
      dispatch(alertError('This city does not exist'));
    }
  } catch (err) {
    // console.log(err);
  }
};

export {
  setAccountSettings,
  setProfileSettings,
  setSearchPreferences,
  setSettings,
  updateAccountSettings,
  updateSearchPreferences,
  updatePassword,
  createTag,
  deleteTag,
  updateBio,
  addImage,
  removeImage,
  setAvatar,
  fetchCitySuggestions,
  saveCity,
};
