import React  from 'react';
import TxDebugger from '../tx/TxDebugger';

export default function Body(props) {
  return (
    <div className={"body"}>
      <div className={"container"}>
        <TxDebugger txHash={props.txHash}/>
      </div>
    </div>
  )
}
