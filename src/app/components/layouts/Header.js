import React, { useState, useEffect } from 'react';
import env from "../../../config/env";

export default function Header(props) {
  const envConfig = env[props.network];
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      props.txInputRef.current.focus();
    }
    // eslint-disable-next-line
  }, [isEditing]);

  function handleEditingTx() {
    if (props.updateTxHash()) {
      setIsEditing(false);
    }
  }

  return (
    <div className={"header"}>
      <div className={"container"}>
        <div className={"header__container"}>
          <img className={"header__logo"} src={require('../../../assets/images/logos/kyber-network.svg')} alt="Kyber Network"/>
          <div className={"header__content"}>
            <div className={"header__title"}>
              <span>Transaction Hash</span>
              <span className={"header__edit-icon"} onClick={() => setIsEditing(!isEditing)}/>
            </div>

            {!isEditing &&
              <div className={"header__tx-container"}>
                <span className={"header__tx"}>{props.txHash}</span>

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
            }

            {isEditing &&
              <div className={"header__tx-container common__fade-in"}>
                <div>
                  <input className={`header__input`} type="text" defaultValue={props.txHash} ref={props.txInputRef}/>
                  <div className={"header__button common__button"} onClick={handleEditingTx}>Debug</div>
                </div>
                <div className={"header__error common__error"}>{props.txError}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
