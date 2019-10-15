import reducer, { selectors } from './reducer';
import * as actions from './actions';

export { default as SettingsContainer } from './SettingsContainer';

export default {
  selectors: selectors,
  actions: actions,
  reducer: reducer,
};
