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
            <div className={"header__content-title"}>Transaction Hash</div>
            <div>
              <span className={"header__content-tx"}>{props.txHash}</span>

              <a href={`${envConfig.ETHERSCAN_URL}/tx/${props.txHash}`} className={"header__content-link"} title="View on Etherscan" target="_blank" rel="noreferrer noopener">
                <img src={require('../../../assets/images/icons/etherscan_explorer.svg')} alt="View on Etherscan"/>
              </a>

              {envConfig.ENJINX_URL && (
                <a href={`${envConfig.ENJINX_URL}/eth/transaction/${props.txHash}`} className={"header__content-link"} title="View on Kyber.Enjinx" target="_blank" rel="noreferrer noopener">
                  <img src={require('../../../assets/images/icons/kyber_explorer.svg')} alt="View on Kyber.Enjinx"/>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
