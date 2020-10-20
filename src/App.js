import React from 'react';
import $ from 'jquery';
import { Scroll } from './Main';
import { PageCalculators, PageCheckout, PagePapers } from './Pages';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Theme } from './UI';

window.jQuery = $;

function App() {
  return (
    <Router>
      <Theme>
        <div className="App">
          <Switch>
            <Route path="/papers">
              <PagePapers />
            </Route>
            <Route path="/calculators">
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
