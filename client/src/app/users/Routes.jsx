import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProfileContainer from './profile/ProfileContainer';

function Routes({
  match: { path },
}) {
  return (
    <Switch>
      <Route path={`${path}/:id`} component={ProfileContainer} />
    </Switch>
  );
}

export default Routes;
