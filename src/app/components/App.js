import React from 'react';
import '../../assets/scss/index.scss';
import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';

export default function App(props) {
  const urlParams = props.match.params;
  const txHash = urlParams.txHash;
  const network = urlParams.network ? urlParams.network : 'mainnet';

  return (
    <div className={'app'}>
      <Header
        txHash={txHash}
        network={network}
      />

      <Body
        txHash={txHash}
        network={network}
      />
      <Footer/>
    </div>
  )
}
