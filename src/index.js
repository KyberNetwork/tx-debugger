import React from 'react';
import { render } from 'react-dom';
import App from './app/components/App';
import * as serviceWorker from './serviceWorker';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom'
import { AppProvider } from "./app/reducers";

const routing = (
  <AppProvider>
    <Router>
      <div>
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/:txHash?/:network?`} component={App}/>
        </Switch>
      </div>
    </Router>
  </AppProvider>
);

render(routing, document.getElementById('root'));

serviceWorker.unregister();
