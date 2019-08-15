import React, { useState } from 'react';
import '../../assets/scss/index.scss';
import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';

export default function App(props) {
  const urlParams = props.match.params;
  const network = urlParams.network ? urlParams.network : 'mainnet';
  const [txHash, setTxHash] = useState(urlParams.txHash);

  function changeRoute(route) {
    props.history.push(process.env.PUBLIC_URL + route);
  }

  return (
    <div className={'app'}>
      <Header
        txHash={txHash}
        setTxHash={setTxHash}
        network={network}
        changeRoute={changeRoute}
      />

      <Body
        txHash={txHash}
        network={network}
      />
      <Footer/>
    </div>
  )
}
