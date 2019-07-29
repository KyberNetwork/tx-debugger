export const globalActionTypes = {
  SET_ERROR: 'GLOBAL.SET_ERROR',
};

export function setError(error) {
  return {
    type: globalActionTypes.SET_ERROR,
    payload: error
  }
}
