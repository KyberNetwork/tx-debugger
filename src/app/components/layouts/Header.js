import React from 'react';
import env from "../../../config/env";

export default function Header(props) {
  const envConfig = env[props.network];

  return (
    <div className={"header"}>
      <div className={"container"}>
        <div className={"header__container"}>
          <img className={"header__logo"} src={require('../../../assets/images/logos/kyber-network.svg')} alt="Kyber Network"/>
          <div className={"header__content"}>
            <div className={"header__title"}>Transaction Hash</div>

            <div className={"header__tx-container common__fade-in"}>
              <div>
                <input className={`header__input`} type="text" defaultValue={props.txHash} ref={props.txInputRef}/>
                <div className={"header__button common__button"} onClick={props.updateTxHash}>Debug</div>

                <div className={"header__link-container"}>
                  <a href={`${envConfig.ETHERSCAN_URL}/tx/${props.txHash}`} className={"header__link"}
                     title="View on Etherscan" target="_blank" rel="noreferrer noopener">
                    <img src={require('../../../assets/images/icons/etherscan_explorer.svg')} alt="View on Etherscan"/>
                  </a>

                  {envConfig.ENJINX_URL && (
                    <a href={`${envConfig.ENJINX_URL}/eth/transaction/${props.txHash}`} className={"header__link"}
                       title="View on Kyber.Enjinx" target="_blank" rel="noreferrer noopener">
                      <img src={require('../../../assets/images/icons/kyber_explorer.svg')} alt="View on Kyber.Enjinx"/>
                    </a>
                  )}
                </div>

                {props.txError &&
                  <div className={"header__error common__error common__fade-in"}>{props.txError}</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
