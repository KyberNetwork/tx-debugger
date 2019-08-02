import React  from 'react';

export default function Header(props) {
  return (
    <div className={"header"}>
      <div className={"container"}>
        <div className={"header__container"}>
          <img className={"header__logo"} src={require('../../../assets/images/logos/kyber-network.svg')} alt="Kyber Network"/>
          <div className={"header__content"}>
            <div className={"header__content-title"}>Transaction Hash</div>
            <div className={"header__content-tx"}>{props.txHash}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
