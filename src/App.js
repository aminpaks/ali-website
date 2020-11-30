import React from 'react';
import $ from 'jquery';
import { Scroll } from './Main';
import {
  PageCalculators,
  PageCheckout,
  PagePapers,
  PageMortgageCalculator,
  PageAboutUs,
} from './Pages';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Nav, Theme } from './UI';

window.jQuery = $;

const StateValueContext = React.createContext();
const StateUpdaterContext = React.createContext();

export const useGlobalState = () => {
  return React.useContext(StateValueContext);
};
export const useUpdateState = () => {
  return React.useContext(StateUpdaterContext);
};

let x = null;

function App() {
  const [state, updateState] = React.useState({ value: 'check' });

  if (x !== updateState) {
    x = updateState;
    console.log('update render', x);
  }

  return (
    <StateUpdaterContext.Provider value={updateState}>
      <StateValueContext.Provider value={state}>
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
                <Route path="/about-us">
                  <PageAboutUs />
                </Route>
                <Route path="/">
                  <Scroll />
                </Route>
              </Switch>
            </div>
          </Theme>
        </Router>
      </StateValueContext.Provider>
    </StateUpdaterContext.Provider>
  );
}

export default App;
