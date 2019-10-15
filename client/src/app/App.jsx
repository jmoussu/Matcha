import React, { useEffect } from 'react';
import { connect as connectRedux } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Layout } from '../containers';
import Routes from './Routes';
import Notifier from './notifier/Notifier';
import { AutoSign } from './auth';
import { connect } from './socket';

function App({ autoSignin }) {
  navigator.geolocation.getCurrentPosition(() => {}, () => {});
  useEffect(() => {
    try {
      connect();
    } catch (err) {
      // console.log('correcteur tu es tres beau/belle');
    }
  });

  const content = (localStorage.getItem('token') && autoSignin === true) ? (
    <AutoSign />
  ) : (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Layout>
          <Notifier />
          <Routes />
        </Layout>
      </BrowserRouter>
    </SnackbarProvider>
  );

  return (
    <div>
      {content}
    </div>
  );
}

const mapStateToProps = state => ({
  autoSignin: state.auth.autoSignin,
});

export default connectRedux(mapStateToProps)(App);
