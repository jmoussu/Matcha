/* eslint-disable react/prop-types */
import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { removeSnackbar } from './actions';
import { getNofifications } from './reducers';

class Notifier extends Component {
  displayed = [];

  shouldComponentUpdate({ notifications: newSnacks = [] }) {
    const { closeSnackbar, removeSnackbar: onRemoveSnackbar } = this.props;
    if (!newSnacks.length) {
      this.displayed = [];
      return false;
    }

    const { notifications: currentSnacks } = this.props;
    let notExists = false;
    for (let i = 0; i < newSnacks.length; i += 1) {
      const newSnack = newSnacks[i];
      if (newSnack.dismissed) {
        closeSnackbar(newSnack.key);
        onRemoveSnackbar(newSnack.key);
      }
      if (notExists) continue;
      notExists = notExists || !currentSnacks.filter(({ key }) => newSnack.key === key).length;
    }
    return notExists;
  }

  componentDidUpdate() {
    const { notifications = [], enqueueSnackbar, removeSnackbar: onRemoveSnackbar } = this.props;

    notifications.forEach(({ key, message, options = {} }) => {
      // Do nothing if snackbar is already displayed
      if (this.displayed.includes(key)) return;
      // Display snackbar using notistack
      enqueueSnackbar(message, {
        ...options,
        onClose: (event, reason, keye) => {
          if (options.onClose) {
            options.onClose(event, reason, keye);
          }
          // Dispatch action to remove snackbar from redux store
          onRemoveSnackbar(key);
        },
      });
      // Keep track of snackbars that we've displayed
      this.storeDisplayed(key);
    });
  }

  storeDisplayed = (id) => {
    this.displayed = [...this.displayed, id];
  };

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  notifications: getNofifications(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({ removeSnackbar }, dispatch);

export default withSnackbar(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notifier));
