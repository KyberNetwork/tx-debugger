import React  from 'react';
import '../../assets/scss/index.scss';
import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';

export default function App(props) {
  const txHash = props.match.params.txHash;

  return (
    <div className={'app'}>
      <Header txHash={txHash}/>
      <Body txHash={txHash}/>
      <Footer/>
    </div>
  )
}
