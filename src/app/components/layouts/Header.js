import React, { useState, useRef, useEffect } from 'react';
import env from "../../../config/env";
import { validateTxHash } from "../../../utils/validators";

export default function Header(props) {
  const envConfig = env[props.network];
  const txHashInputRef = useRef(props.txHash);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      txHashInputRef.current.focus();
    }
  }, [isEditing]);

  function handleEditingTx() {
    const hash = txHashInputRef.current.value;

    if (!validateTxHash(hash)) {
      setError('Your TX Hash is invalid.');
      return;
    }

    props.changeRoute(`/${hash}`);
    props.setTxHash(hash);
    setIsEditing(false);
    setError(null);
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
                  <input className={`header__input`} type="text" defaultValue={props.txHash} ref={txHashInputRef}/>
                  <div className={"header__button"} onClick={handleEditingTx}>Done</div>
                </div>
                <div className={"header__error"}>{error}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
