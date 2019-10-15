import React from 'react';
import { connect } from 'react-redux';
import AppBar from '../../app/nav/appbar/AppBar';

function Layout(props) {
  const { children, auth } = props;

  return (
    <div>
      <AppBar auth={auth} />
      <main>
        {children}
      </main>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth.isAuth,
});

export default connect(mapStateToProps)(Layout);
