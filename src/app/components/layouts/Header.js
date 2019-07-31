import React  from 'react';

export default function Header() {
  return (
    <div className={"header"}>
      <div className={"container"}>
        <div className={"header__container"}>
          <img className={"header__logo"} src={require('../../../assets/images/logos/kyber-network.svg')} alt="Kyber Network"/>
          <div className={"header__content"}>
            <div className={"header__content-title"}>Transaction Hash</div>
            <div className={"header__content-tx"}>0xae7658fa2476e6895c100763eb1ba46778cf024d8e57d8578ec5deac3ef00253</div>
          </div>
        </div>
      </div>
    </div>
  )
}
