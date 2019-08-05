import React from 'react';
import { render } from 'react-dom';
import App from './app/components/App';
import Error from './app/components/layouts/Error';
import * as serviceWorker from './serviceWorker';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom'
import {AppProvider} from "./app/reducers";

const routing = (
  <AppProvider>
    <Router>
      <div>
        <Switch>
          <Route exact path="/tx/:txHash" component={App} />
          <Route exact path="/error" component={Error} />
          <Redirect to={`/error`}/>
        </Switch>
      </div>
    </Router>
  </AppProvider>
);

render(routing, document.getElementById('root'));

serviceWorker.unregister();
