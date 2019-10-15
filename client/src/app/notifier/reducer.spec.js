import { expect } from 'chai';
import * as actions from './actionTypes';
import reducer from './reducers';

const initialState = {
  notifications: [],
};

describe('Notifier reducer', () => {
  it('return a state', () => {
    const state = reducer(undefined, {});
    expect(state).to.deep.equal(initialState);
  });

  describe('when add a notification to queue', () => {
    const action = {
      type: actions.ENQUEUE_SNACKBAR,
      notification: {
        test: true,
        key: 123,
      },
    };
    it('add notification to state', () => {
      const state = reducer(undefined, action);
      expect(state.notifications).has.length(1);
      expect(state.notifications[0]).has.property('key');
      expect(state.notifications[0]).has.property('test');
    });
  });

  describe('when remove a notification', () => {
    const addAction = {
      type: actions.ENQUEUE_SNACKBAR,
      notification: {
        test: true,
        key: 123,
      },
    };

    const removeAction = {
      type: actions.REMOVE_SNACKBAR,
      key: 123,
    };

    it('remove notification from list', () => {
      let state = reducer(undefined, addAction);
      state = reducer(state, removeAction);
      expect(state.notifications).has.length(0);
    });
  });
});
