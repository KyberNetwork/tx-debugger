import { fork, all } from 'redux-saga/effects';
import accountWatcher from './accountSaga';

export default function* rootSaga() {
  yield all([
    fork(accountWatcher),
  ]);
}
