import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Authorization from '../pages/authorization';
import Socket from '../pages/socket';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Authorization}/>
        <Route exact path="/socket" component={Socket}/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;