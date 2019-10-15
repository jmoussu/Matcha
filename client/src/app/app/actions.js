import * as actions from './actionTypes';
import appService from './service';

const fetchTagsSuccess = tags => ({
  type: actions.FETCH_APP_TAGS_SUCCESS,
  payload: tags,
});

const fetchTagsFail = () => ({
  type: actions.FETCH_APP_TAGS_FAILED,
});

const fetchTags = () => async (dispatch) => {
  dispatch({ type: actions.FETCH_APP_TAGS });
  try {
    const tags = await appService.getAllTags(); 
    dispatch(fetchTagsSuccess(tags));
  } catch (err) {
    // console.log(err);
    dispatch(fetchTagsFail());
  }
};

export default {
  fetchTags,
};
