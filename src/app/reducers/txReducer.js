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
    contract: {
      name: 'Contract Address',
      isChecked: false,
      error: '',
      step: 4
    },
    tradeFunction: {
      name: 'Trade Function',
      isChecked: false,
      error: '',
      step: 5
    },
    sourceAmount: {
      name: 'Source Amount',
      isChecked: false,
      error: '',
      step: 6
    },
    maxDestAmount: {
      name: 'Max Dest Amount',
      isChecked: false,
      error: '',
      step: 7
    },
    gasUsed: {
      name: 'Gas Used',
      isChecked: false,
      error: '',
      step: 8
    },
    gasPrice: {
      name: 'Gas Price',
      isChecked: false,
      error: '',
      step: 9
    },
    etherValue: {
      name: 'ETH Value',
      isChecked: false,
      error: '',
      step: 10
    },
    allowance: {
      name: 'Allowance',
      isChecked: false,
      error: '',
      step: 11
    },
    balance: {
      name: 'Balance',
      isChecked: false,
      error: '',
      step: 12
    },
    etherAmount: {
      name: 'ETH Amount',
      isChecked: false,
      error: '',
      step: 13
    },
    rate: {
      name: 'Rate',
      isChecked: false,
      error: '',
      step: 14
    },
    minRate: {
      name: 'Min Conversion Rate',
      isChecked: false,
      error: '',
      step: 15
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
    case txActionTypes.RESET_TX_STATUS: {
      return initialTxState
    }
    default:
      return state;
  }
}
