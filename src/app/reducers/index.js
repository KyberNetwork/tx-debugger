import React, { createContext, useReducer } from 'react';
import { initialTxState, txReducer } from "./txReducer";

const AppContext = createContext({
  tx: initialTxState
});

function AppProvider(props) {
  const [tx, txDispatch] = useReducer(txReducer, initialTxState);

  return (
    <AppContext.Provider value={{ tx, txDispatch }}>
      {props.children}
    </AppContext.Provider>
  )
}

export { AppContext, AppProvider }
