import React from 'react';
// import logo from './logo.svg';
import { Scroll, Calculator } from './Main';
import './App.css';

function App() {
  return (
    <div className="App">
      {false && <Scroll />}
      <Calculator />
    </div>
  );
}

export default App;
