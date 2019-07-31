import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import reducer from './app/reducers';
import App from './app/components/App';
import rootSaga from './app/sagas';
import * as serviceWorker from './serviceWorker';

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

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
