import { txActionTypes } from '../actions/txAction';

export const initialTxState = {
  currentStep: 1,
  errors: {
    tx: {
      name: 'Transaction Hash',
      isChecked: false,
      error: '',
      step: 1
    },
    tradeFunction: {
      name: 'Trade Function',
      isChecked: false,
      error: '',
      step: 2
    },
    gasUsed: {
      name: 'Gas Used',
      isChecked: false,
      error: '',
      step: 3
    },
    gasPrice: {
      name: 'Gas Price',
      isChecked: false,
      error: '',
      step: 4
    },
    etherValue: {
      name: 'Ether Value',
      isChecked: false,
      error: '',
      step: 5
    },
    allowance: {
      name: 'Allowance',
      isChecked: false,
      error: '',
      step: 6
    },
    balance: {
      name: 'Balance',
      isChecked: false,
      error: '',
      step: 7
    },
    etherAmount: {
      name: 'Ether Amount',
      isChecked: false,
      error: '',
      step: 8
    },
    userCap: {
      name: 'User Cap',
      isChecked: false,
      error: '',
      step: 9
    },
    rate: {
      name: 'Rate',
      isChecked: false,
      error: '',
      step: 10
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
    default:
      return state;
  }
}
