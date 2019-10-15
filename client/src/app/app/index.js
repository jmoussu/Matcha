import { getStore } from './store';
import appReducer, { selectors } from './reducer';
import actionCreators from './actions';

export default {
  getStore,
  reducers: {
    appReducer,
  },
  selectors: { ...selectors },
  actions: { ...actionCreators },
};
