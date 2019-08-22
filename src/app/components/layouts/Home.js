import React  from 'react';

export default function Home(props) {
  return (
    <div className={"home"}>
      <div className={"container"}>
        <img className={"home__logo"} src={require('../../../assets/images/logos/kyber-network.svg')} alt="Kyber Network"/>
        <div className={"home__content"}>
          <input className={"home__input"} placeholder={"Paste your transaction hash here"} ref={props.txInputRef} onKeyUp={props.handleKeyUpOnTxInput}/>
          <div className={"home__button common__button"} onClick={props.updateTxHash}>Debug</div>
        </div>
        {props.txError &&
          <div className={"common__error common__fade-in"}>{props.txError}</div>
        }
      </div>
    </div>
  )
}
