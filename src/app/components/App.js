import React, { useState, Fragment, useRef } from 'react';
import '../../assets/scss/index.scss';
import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';
import Home from './layouts/Home';
import { validateTxHash } from "../../utils/validators";

export default function App(props) {
  const urlParams = props.match.params;
  const network = urlParams.network ? urlParams.network : 'mainnet';
  const [txHash, setTxHash] = useState(urlParams.txHash);
  const [txError, setTxError] = useState(null);
  const txInputRef = useRef(txHash);

  function changeRoute(route) {
    props.history.push(process.env.PUBLIC_URL + route);
  }

  function updateTxHash() {
    const hash = txInputRef.current.value;

    if (!validateTxHash(hash)) {
      setTxError('Your TX Hash is invalid.');
      return false;
    }

    changeRoute(`/${hash}`);
    setTxHash(hash);
    setTxError(null);

    return true;
  }

  return (
    <div className={'app'}>
      {txHash && (
        <Fragment>
          <Header
            txHash={txHash}
            txError={txError}
            txInputRef={txInputRef}
            updateTxHash={updateTxHash}
            network={network}
          />

          <Body
            txHash={txHash}
            network={network}
          />

          <Footer/>
        </Fragment>
      )}

      {!txHash && (
        <Home
          txError={txError}
          txInputRef={txInputRef}
          updateTxHash={updateTxHash}
        />
      )}
    </div>
  )
}
