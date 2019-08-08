import React, { useContext, useEffect, useRef } from 'react';
import useTxDebugger from "./TxDebuggerHook";
import { AppContext } from "../../reducers";
import TypingEffect from "../commons/TypingEffect";

export default function TxDebugger(props) {
  let bugCount = 0;
  const { tx } = useContext(AppContext);

  useTxDebugger(props.txHash);
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current.scrollTo({top: contentRef.current.scrollHeight, behavior: 'smooth'});
  }, [tx.currentStep, tx.isDebuggingCompleted]);

  function renderDebugTerminal() {
    return (
      <div>
        <div className={"tx-debugger__text tx-debugger__text--white"}>
          <TypingEffect text="Debugging..."/>
        </div>

        {Object.entries(tx.errors).map((value, key) => {
          const error = value[1];

          return (
            <div key={key}>
                {(tx.currentStep >= error.step) && (
                  <div className={"tx-debugger__text"}>
                    <span>Checking {error.name}...</span>

                    {!error.isChecked && (
                      <span className={"common__blink"}>|</span>
                    )}
                  </div>
                )}

                {error.isChecked && (
                  <div className={`tx-debugger__text tx-debugger__text--${error.error ? 'red' : 'green'}`}>Done checking {error.name}</div>
                )}
            </div>
          )
        })}

        {tx.isDebuggingCompleted && (
          <div className={"tx-debugger__text tx-debugger__text--white"}>
            <TypingEffect text="Done Debugging."/>
            <span className={"common__blink"}>|</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={"tx-debugger"}>
      <div className={"tx-debugger__box tx-debugger__debug"}>
        <div className={"tx-debugger__header"}>Debug</div>
        <div className={"tx-debugger__content"} ref={contentRef}>
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
                <div key={key} className={"tx-debugger__item common__fade-in"}>
                  <span className={"tx-debugger__number"}>{bugCount}</span>
                  <span className={"tx-debugger__bug"}>{error}</span>
                </div>
              )
            }

            return '';
          })}

          {(tx.isDebuggingCompleted && !bugCount) && (
            <div className={"tx-debugger__item common__fade-in"}>
              <span className={"tx-debugger__bug"}>Everything seems to be OK</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
