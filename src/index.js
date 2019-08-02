import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import reducer from './app/reducers';
import App from './app/components/App';
import Error from './app/components/layouts/Error';
import rootSaga from './app/sagas';
import * as serviceWorker from './serviceWorker';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom'

const sagaMiddleware = createSagaMiddleware();
let middleware = [sagaMiddleware];

if (process.env.REACT_APP_ENV === 'development') {
  middleware = [...middleware, logger]
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware),
);

sagaMiddleware.run(rootSaga);

const routing = (
  <Provider store={store}>
    <Router>
      <div>
        <Switch>
          <Route exact path="/tx/:txHash" component={App} />
          <Route exact path="/error" component={Error} />
          <Redirect to={`/error`}/>
        </Switch>
      </div>
    </Router>
  </Provider>
);

render(routing, document.getElementById('root'));

serviceWorker.unregister();
