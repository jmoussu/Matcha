import * as actions from './actionTypes';

const initialState = {
  userId: null,
  msgList: [],
  avatar: null,
};

const fetchMsgSuccess = (state, action) => ({
  ...state,
  userId: action.payload.userId,
  msgList: action.payload.messages,
  avatar: action.payload.avatar,
});

const messageReceived = (state, action) => ({
  ...state,
  msgList: [...state.msgList, action.payload],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SUBSCRIBE_ON_MESSAGE: return state;
    case actions.FETCH_MESSAGES: return state;
    case actions.FETCH_MESSAGES_FAIL: return state;
    case actions.FETCH_MESSAGES_SUCCESS: return fetchMsgSuccess(state, action);

    case actions.SEND_MESSAGE: return state;
    case actions.SEND_MESSAGE_FAIL: return state;
    case actions.SEND_MESSAGE_SUCCESS: return state;

    case actions.MESSAGE_RECEIVED: return messageReceived(state, action);
    default: return state;
  }
}

export const selectors = {
  getUserId: state => state.chat.userId,
  getMessages: state => state.chat.msgList,
  getAvatar: state => state.chat.avatar,
};
