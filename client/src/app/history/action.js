import * as actions from './actionTypes';
import { prepareBaseApiWithAuth } from '../../axios-instances';
import { alertError } from '../notifier';

const fetchHistoryVisistsSucces = () => ({
  type: actions.FETCH_HISTORY_VISITS_SUCCESS,
});

const fetchHistoryLikesSucces = () => ({
  type: actions.FETCH_HISTORY_VISITS_SUCCESS,
});

const setHistoryVisitList = visitList => ({
  type: actions.SET_HISTORY_VISITS_LIST,
  payload: visitList,
});

const setHistoryLikeList = likeList => ({
  type: actions.SET_HISTORY_LOVE_LIST,
  payload: likeList,
});

export const getAllVisits = () => async (dispatch) => {
  // console.log('start fetch all likes');
  const api = prepareBaseApiWithAuth();
  dispatch({ type: actions.FETCH_HISTORY_VISITS });
  try {
    const response = await api.post('/history/visits');
    dispatch(setHistoryVisitList(response.data.result));
    dispatch(fetchHistoryVisistsSucces());
  } catch (err) {
    // console.log(err);
    dispatch(alertError(err.response.data.message));
    dispatch({ type: actions.FETCH_HISTORY_VISITS_FAIL });
  }
};

export const getAllLikes = () => async (dispatch) => {
  const api = prepareBaseApiWithAuth();
  dispatch({ type: actions.FETCH_HISTORY_LOVE });
  try {
    const response = await api.post('/history/likes');
    dispatch(setHistoryLikeList(response.data.result));
    dispatch(fetchHistoryLikesSucces());
  } catch (err) {
    dispatch(alertError(err.response.data.message));
    dispatch({ type: actions.FETCH_HISTORY_VISITS_FAIL });
  }
};
