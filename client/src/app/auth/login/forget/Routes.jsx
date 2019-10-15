import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PasswordResetPage from './Reset';
import PasswordForgetPage from './Forget';

export default function ForgetRoutes({ match: { path } }) {
  return (
    <div>
      <Switch>
        <Route
          path={`${path}/reset/:email/:token`}
          component={PasswordResetPage}
        />
        <Route exact path={`${path}/`} component={PasswordForgetPage} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
}
