import React from 'react';
import $ from 'jquery';
import { Scroll } from './Main';
import {
  PageCalculators,
  PageCheckout,
  PagePapers,
  PageMortgageCalculator,
} from './Pages';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Nav, Theme } from './UI';

window.jQuery = $;

function App() {
  return (
    <Router>
      <Theme>
        <div className="App">
          <Nav />
          <Switch>
            <Route path="/papers">
              <PagePapers />
            </Route>
            <Route path="/mortgage-calculator">
              <PageMortgageCalculator />
            </Route>
            <Route path="/investment-calculator">
              <PageCalculators />
            </Route>
            <Route path="/checkout">
              <PageCheckout />
            </Route>
            <Route path="/">
              <Scroll />
            </Route>
          </Switch>
        </div>
      </Theme>
    </Router>
  );
}

export default App;
