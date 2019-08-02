import React from 'react';
import useTxDebugger from "./TxDebuggerHook";

export default function TxDebugger(props) {
  let bugCount = 0;
  const [step, txErrors] = useTxDebugger(props.txHash);

  function renderDebugTerminal() {
    return (
      <div>
        <div className={"tx-debugger__text tx-debugger__text--white"}>Debugging...</div>
        {Object.entries(txErrors).map((value, key) => {
          const txError = value[1];

          return (
            <div key={key}>
              {(step >= txError.step || step === 0) && (
                <div className={"tx-debugger__text"}>Checking {txError.name}...</div>
              )}

              {(step > txError.step || step === 0) && (
                <div className={`tx-debugger__text tx-debugger__text--${txError.error ? 'red' : 'green'}`}>
                  Done checking {txError.name}.
                </div>
              )}
            </div>
          )
        })}

        {step === 0 && (
          <div className={"tx-debugger__text tx-debugger__text--white"}>Done Debugging.</div>
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
          {Object.entries(txErrors).map((value, key) => {
            if (value[1].error) {
              bugCount++;
              return (
                <div key={key} className={"tx-debugger__item"}>
                  <span className={"tx-debugger__number"}>{bugCount}</span>
                  <span className={"tx-debugger__bug"}>{value[1].error}</span>
                </div>
              )
            }

            return '';
          })}
        </div>
      </div>
    </div>
  )
}
