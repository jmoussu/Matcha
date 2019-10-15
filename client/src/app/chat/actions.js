/* eslint-disable eqeqeq */
import * as actions from './actionTypes';
import { baseApiUrl, prepareBaseApiWithAuth } from '../../axios-instances';
import { alertError } from '../notifier';
import io from '../socket';

const fetchMessagesSuccess = (msgList, id, avatarUrl) => ({
  type: actions.FETCH_MESSAGES_SUCCESS,
  payload: {
    messages: msgList,
    userId: id,
    avatar: avatarUrl,
  },
});

const fetchMessagesFail = () => ({
  type: actions.FETCH_MESSAGES_FAIL,
});

export const fetchMessages = id => async (dispatch) => {
  dispatch({ type: actions.FETCH_MESSAGES });
  const api = prepareBaseApiWithAuth();
  try {
    const response = await api.get(`/chats/get/${id}`);
    const { result, path } = response.data;
    dispatch(fetchMessagesSuccess(result, id, `${baseApiUrl}/${path}`));
  } catch (err) {
    // console.log(err);
    dispatch(fetchMessagesFail());
    dispatch(alertError(err.response.data.message));
  }
};

const onMessageReceived = msg => ({
  type: actions.MESSAGE_RECEIVED,
  payload: msg,
});

export const subscribeToMessageEvent = () => (dispatch, getState) => {
  dispatch({ type: actions.SUBSCRIBE_ON_MESSAGE });
  io.on('message', (data) => {
    const { author } = data;
    const chatUserId = getState().chat.userId;
    const authId = getState().auth.userId;
    if ((author == authId) || (author == chatUserId)) {
      dispatch(onMessageReceived(data));
    }
  });
};

export const sendMessage = (id, msg) => async (dispatch) => {
  dispatch({ type: actions.SEND_MESSAGE });
  try {
    const api = prepareBaseApiWithAuth();
    const response = await api.post('/chats/add', {
      id_profil: id,
      message: msg,
    });
    dispatch({
      type: actions.SEND_MESSAGE_SUCCESS,
      payload: msg,
    });
    dispatch(onMessageReceived(response.data));
  } catch (err) {
    dispatch(alertError(err.response.data.message));
    dispatch({ type: actions.SEND_MESSAGE_FAIL });
  }
};
