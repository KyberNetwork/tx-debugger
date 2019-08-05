export const txActionTypes = {
  SET_TX_ERROR: 'TX.SET_TX_ERROR',
  SET_TX_STEP: 'TX.SET_TX_STEP',
  SET_TX_DEBUGGING_COMPLETED: 'TX.SET_TX_DEBUGGING_COMPLETED',
};

export function setTxError(key, error = '', isChecked = true) {
  return {
    type: txActionTypes.SET_TX_ERROR,
    payload: { key, error, isChecked }
  }
}

export function setTxStep(step) {
  return {
    type: txActionTypes.SET_TX_STEP,
    payload: step
  }
}

export function setTxDebuggingCompleted(isCompleted = true) {
  return {
    type: txActionTypes.SET_TX_DEBUGGING_COMPLETED,
    payload: isCompleted
  }
}
