/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../actions';

function Logout({ onLogout }) {
  useEffect(() => {
    onLogout();
    return () => location.reload();
  }, [onLogout]);
  return (<Redirect to="/" />);
}

const mapDispatchToProps = dispatch => ({
  onLogout: () => { dispatch(logout()); },
});

export default connect(null, mapDispatchToProps)(Logout);
