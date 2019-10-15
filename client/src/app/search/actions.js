import * as actions from './actionTypes';
import { prepareBaseApiWithAuth } from '../../axios-instances';

export const fetchCustomSearch = searchPref => async (dispatch) => {
  dispatch({ type: actions.FETCH_CUSTOM_SEARCH });
  const api = prepareBaseApiWithAuth();
  try {
    const response = await api.post('/research/find', searchPref);
    dispatch({
      type: actions.FETCH_CUSTOM_SEARCH_SUCCESS,
      payload: response.data.result,
    });
  } catch (err) {
    dispatch({ type: actions.FETCH_CUSTOM_SEARCH_FAIL });
  }
};

export const resetProfiles = () => dispatch => dispatch({ type: actions.RESET_SEARCH_PROFILES });

export const sortProfiles = type => async (dispatch) => {
  switch (type) {
    case 'age': return dispatch({ type: actions.SORT_RESULT_BY_AGE });
    case 'popularity': return dispatch({ type: actions.SORT_RESULT_BY_POPULARITY });
    case 'tags': return dispatch({ type: actions.SORT_RESULT_BY_TAG });
    case 'location': return dispatch({ type: actions.SORT_RESULT_BY_LOCATION });
    default: throw new Error('raised by default');
  }
};
