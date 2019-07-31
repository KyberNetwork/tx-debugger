import React  from 'react';
import '../../assets/scss/index.scss';
import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';

export default function App() {
  return (
    <div className={'app'}>
      <Header/>
      <Body/>
      <Footer/>
    </div>
  )
}
