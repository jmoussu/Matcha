import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import { authReducer } from '../auth';
import alertReducer from '../notifier/reducers';
import settings from '../settings';
import appReducer from './reducer';
import users from '../users';
import { notifReducer } from '../notifications';
import { HistoryReducer } from '../history';
import { chatReducer } from '../chat';
import { SearchReducer } from '../search';

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  settings: settings.reducer,
  app: appReducer,
  users: users.reducer,
  notif: notifReducer,
  history: HistoryReducer,
  chat: chatReducer,
  search: SearchReducer,
});

// this line must be extract out of there
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function getStore() {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};
