import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginContainer from './LoginContainer';
import ForgetRoutes from './forget/Routes';

export default function PasswordPage(props) {
  const { match: { path } } = props;
  return (
    <div>
      <Switch>
        <Route path={`${path}/forget`} component={ForgetRoutes} />
        <Route exact path={`${path}/`} component={LoginContainer} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
}
