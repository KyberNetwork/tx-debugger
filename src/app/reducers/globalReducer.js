import { globalActionTypes } from '../actions/globalAction';

const initialState = {
  error: '',
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    case globalActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    default:
      return state;
  }
}
