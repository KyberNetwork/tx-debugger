import React, {useContext} from 'react';
import useTxDebugger from "./TxDebuggerHook";
import { AppContext } from "../../reducers";

export default function TxDebugger(props) {
  useTxDebugger(props.txHash);

  let bugCount = 0;
  const { tx } = useContext(AppContext);

  function animateText(text) {
    const characters = text.split('');

    return characters.map((character, index) => {
      return <span key={index} className={"common__typing-text"}>{character}</span>;
    });
  }

  function renderDebugTerminal() {
    return (
      <div>
        <div className={"tx-debugger__text tx-debugger__text--white"}>{animateText('Debugging...')}</div>

        {Object.entries(tx.errors).map((value, key) => {
          const error = value[1];

          return (
            <div key={key}>
              {(tx.currentStep >= error.step) && (
                <div className={"tx-debugger__text"}>{animateText(`Checking ${error.name}...`)}</div>
              )}

              {error.isChecked && (
                <div className={`tx-debugger__text tx-debugger__text--${error.error ? 'red' : 'green'}`}>
                  {animateText(`Done checking ${error.name}.`)}
                </div>
              )}
            </div>
          )
        })}

        {tx.isDebuggingCompleted && (
          <div className={"tx-debugger__text tx-debugger__text--white"}>{animateText(`Done Debugging.`)}</div>
        )}
      </div>
    );
  }

  return (
    <div className={"tx-debugger"}>
      <div className={"tx-debugger__box tx-debugger__debug"}>
        <div className={"tx-debugger__header"}>Debug</div>
        <div className={"tx-debugger__content"}>
          {renderDebugTerminal()}
        </div>
      </div>

      <div className={"tx-debugger__box tx-debugger__summary"}>
        <div className={"tx-debugger__header"}>Bug Summary</div>
        <div className={"tx-debugger__content"}>
          {Object.entries(tx.errors).map((value, key) => {
            const error = value[1].error;

            if (error) {
              bugCount++;

              return (
                <div key={key} className={"tx-debugger__item"}>
                  <span className={"tx-debugger__number"}>{bugCount}</span>
                  <span className={"tx-debugger__bug"}>{error}</span>
                </div>
              )
            }

            return '';
          })}

          {(tx.isDebuggingCompleted && !bugCount) && (
            <div className={"tx-debugger__item"}>
              <span className={"tx-debugger__bug"}>Everything seems to be OK</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
