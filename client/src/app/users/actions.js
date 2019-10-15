import * as actions from './actionTypes';
import { getUserInfos, toggleLike } from './service';
import { alertError, alertSuccess } from '../notifier';
import { prepareBaseApiWithAuth } from '../../axios-instances';

const setUserProfileInfos = infos => ({
  type: actions.SET_USER_PROFILE_INFOS,
  payload: infos,
});

const fetchUserProfileInfosSuccess = () => ({
  type: actions.FETCH_USER_PROFILE_INFOS_SUCCESS,
});

const fetchUserProfileInfosFail = () => ({
  type: actions.FETCH_USER_PROFILE_INFOS_FAIL,
});

export const fetchUserProfileInfos = id => async (dispatch) => {
  dispatch({ type: actions.FETCH_USER_PROFILE_INFOS });
  try {
    const userInfo = await getUserInfos(id);
    dispatch(setUserProfileInfos(userInfo));
    dispatch(fetchUserProfileInfosSuccess());
  } catch (err) {
    dispatch(fetchUserProfileInfosFail());
  }
  const api = prepareBaseApiWithAuth();
  try {
    await api.post('visits/add', { id_profil: id });
    dispatch({ type: actions.MARK_PROFILE_AS_VISITED });
  } catch (err) {
  }
};

export const likeProfile = id => async (dispatch) => {
  dispatch({ type: actions.TOGGLE_LIKE });
  try {
    await toggleLike(id, true);
    dispatch({ type: actions.TOGGLE_LIKE_SUCCESS, payload: { like: true } });
  } catch (err) {
    dispatch(alertError(err.message));
  }
};

export const UnlikeProfile = id => async (dispatch) => {
  dispatch({ type: actions.TOGGLE_LIKE });
  try {
    await toggleLike(id, false);
    dispatch({ type: actions.TOGGLE_LIKE_SUCCESS, payload: { like: false } });
  } catch (err) {
    dispatch(alertError(err.message));
  }
};

export const ReportProfile = (id, type) => async (dispatch) => {

  const url = (type === 'fake') ? '/report' : '/blocks/add';
  const verb = (type === 'fake') ? 'report' : 'block';
  if (type === 'fake') {
    dispatch({ type: actions.REPORT_USER });
  } else {
    dispatch({ type: actions.BLOCK_USER });
  }
  const api = prepareBaseApiWithAuth();
  try {
    await api.post(url, { id_profil: id });
    dispatch(alertSuccess(`This user has been ${verb}`));
  } catch (err) {
    dispatch(alertError(err.response.data.message));
  }
};

export default {
  fetchUserProfileInfos,
};
