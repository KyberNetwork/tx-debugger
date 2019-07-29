import { combineReducers } from 'redux'
import globalReducer from "./globalReducer";

const reducer = combineReducers({
  global: globalReducer,
});

export default reducer
