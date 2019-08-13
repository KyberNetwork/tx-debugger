export const txActionTypes = {
  SET_TX_ERROR: 'TX.SET_TX_ERROR',
  SET_TX_STEP: 'TX.SET_TX_STEP',
  SET_TX_DEBUGGING_COMPLETED: 'TX.SET_TX_DEBUGGING_COMPLETED',
  RESET_TX_STATUS: 'TX.RESET_TX_STATUS',
};

export function setTxError(key, error = '', isChecked = true) {
  return {
    type: txActionTypes.SET_TX_ERROR,
    payload: { key, error, isChecked }
  }
}

export function resetTxStatus() {
  return {
    type: txActionTypes.RESET_TX_STATUS,
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
