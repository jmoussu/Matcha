import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  LoginRoutes,
  LogoutContainer,
  RegisterRoutes,
} from './auth';

import { Routes as UsersRoutes } from './users/index';
import { SettingsContainer } from './settings';

import {
  HomePage,
  ErrorPage,
} from '../containers/pages';

import { NotificationsContainer } from './notifications';
import { Routes as HistoryRoutes } from './history';
import { ChatContainer } from './chat';
import { SearchContainer } from './search';

function Routes({ userLogged }) {
  const content = userLogged ? (
    <Switch>
      <Route exact path="/logout" component={LogoutContainer} />
      <Route exact path="/" component={SearchContainer} />
      <Route exact path="/home" component={SearchContainer} />
      <Route exact path="/account" component={SettingsContainer} />
      <Route exact path="/search" component={SearchContainer} />
      <Route path="/login" component={LoginRoutes} />
      <Route path="/users" component={UsersRoutes} />
      <Route path="/history" component={HistoryRoutes} />
      <Route path="/notifications" component={NotificationsContainer} />
      <Route path="/chat/:id" component={ChatContainer} />
      <Route component={ErrorPage} />
    </Switch>
  ) : (
    <Switch>
      <Route path="/login" component={LoginRoutes} />
      <Route path="/register" component={RegisterRoutes} />
      <Route exact path="/" component={HomePage} />
      <Route exact path="/home" component={HomePage} />
      <Route component={ErrorPage} />
    </Switch>
  );
  return content;
}

const mapStateToProps = state => ({
  userLogged: state.auth.isAuth,
});

export default connect(mapStateToProps)(Routes);
