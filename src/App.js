import React from 'react';
import $ from 'jquery';
// import logo from './logo.svg';
import { Scroll, Calculator } from './Main';
import './App.css';

window.jQuery = $;

function App() {
  return (
    <div className="App">
      {false && <Scroll />}
      <Calculator />
    </div>
  );
}

export default App;
