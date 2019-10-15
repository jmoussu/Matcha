import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import IndexPage from './Index';
import ActivationPage from './Activation';

export default function Routes({ match: { path } }) {
  return (
    <Switch>
      <Route path={`${path}/validate/:email/:token`} component={ActivationPage} />
      <Route component={IndexPage} />
      <Redirect to="404" />
    </Switch>
  );
}
