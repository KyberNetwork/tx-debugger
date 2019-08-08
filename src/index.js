import React from 'react';
import { render } from 'react-dom';
import App from './app/components/App';
import * as serviceWorker from './serviceWorker';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom'
import { AppProvider } from "./app/reducers";

const routing = (
  <AppProvider>
    <Router basename="/tx-diagnose">
      <div>
        <Switch>
          <Route exact path={`${process.env.PUBLIC_URL}/:txHash`} component={App} />
          <Redirect to={`${process.env.PUBLIC_URL}/invalid-tx-hash`}/>
        </Switch>
      </div>
    </Router>
  </AppProvider>
);

render(routing, document.getElementById('root'));

serviceWorker.unregister();
