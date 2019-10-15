import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LikeHistoryContainer from './LikeHistoryContainer';
import ViewHistoryContainer from './VewsHistoryContainer';

const Routes = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/likes`} component={LikeHistoryContainer} />
    <Route path={`${match.path}/visits`} component={ViewHistoryContainer} />
    <Redirect to="/404" />
  </Switch>
);

export default Routes;
