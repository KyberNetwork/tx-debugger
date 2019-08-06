import { txActionTypes } from '../actions/txAction';

export const initialTxState = {
  isDebuggingCompleted: false,
  currentStep: 1,
  errors: {
    tx: {
      name: 'Transaction Hash',
      isChecked: false,
      error: '',
      step: 1
    },
    txNotFound: {
      name: 'Valid Transaction',
      isChecked: false,
      error: '',
      step: 2
    },
    tradeFunction: {
      name: 'Trade Function',
      isChecked: false,
      error: '',
      step: 3
    },
    sourceAmount: {
      name: 'Source Amount',
      isChecked: false,
      error: '',
      step: 4
    },
    gasUsed: {
      name: 'Gas Used',
      isChecked: false,
      error: '',
      step: 5
    },
    gasPrice: {
      name: 'Gas Price',
      isChecked: false,
      error: '',
      step: 6
    },
    etherValue: {
      name: 'ETH Value',
      isChecked: false,
      error: '',
      step: 7
    },
    allowance: {
      name: 'Allowance',
      isChecked: false,
      error: '',
      step: 8
    },
    balance: {
      name: 'Balance',
      isChecked: false,
      error: '',
      step: 9
    },
    etherAmount: {
      name: 'ETH Amount',
      isChecked: false,
      error: '',
      step: 10
    },
    userCap: {
      name: 'User Cap',
      isChecked: false,
      error: '',
      step: 11
    },
    rate: {
      name: 'Rate',
      isChecked: false,
      error: '',
      step: 12
    },
    minRate: {
      name: 'Min Conversion Rate',
      isChecked: false,
      error: '',
      step: 13
    }
  },
};

export function txReducer(state, action) {
  switch (action.type) {
    case txActionTypes.SET_TX_ERROR: {
      const { key, error, isChecked } = action.payload;
      return {
        ...state,
        errors: {
          ...state.errors,
          [key]: { ...state.errors[key], error, isChecked }
        }
      }
    }
    case txActionTypes.SET_TX_UNKNOWN_ERROR: {
      return {
        ...state,
        unknownError: action.payload
      }
    }
    case txActionTypes.SET_TX_STEP: {
      return {
        ...state,
        currentStep: action.payload
      }
    }
    case txActionTypes.SET_TX_DEBUGGING_COMPLETED: {
      return {
        ...state,
        isDebuggingCompleted: action.payload
      }
    }
    default:
      return state;
  }
}
