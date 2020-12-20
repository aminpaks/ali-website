import $ from 'jquery';
import { createContext, useContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  PageAboutUs,
  PageArticles,
  PageCheckout,
  PageContact,
  PageHome,
  PageInvestCalculator,
  PageMortgageCalculator,
} from './Pages';
import { Nav, Theme } from './UI';

const queryClient = new QueryClient();

window.jQuery = $;

const StateValueContext = createContext();
const StateUpdaterContext = createContext();

export const useGlobalState = () => {
  return useContext(StateValueContext);
};
export const useUpdateState = () => {
  return useContext(StateUpdaterContext);
};

function App() {
  const [state, updateState] = useState({ value: 'check' });

  return (
    <StateUpdaterContext.Provider value={updateState}>
      <StateValueContext.Provider value={state}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Theme>
              <div className="App">
                <Nav />
                <Switch>
                  <Route path="/articles">
                    <PageArticles />
                  </Route>
                  <Route path="/mortgage-calculator">
                    <PageMortgageCalculator />
                  </Route>
                  <Route path="/investment-calculator">
                    <PageInvestCalculator />
                  </Route>
                  <Route path="/checkout">
                    <PageCheckout />
                  </Route>
                  <Route path="/about-us">
                    <PageAboutUs />
                  </Route>
                  <Route path="/contact">
                    <PageContact />
                  </Route>
                  <Route path="/">
                    <PageHome />
                  </Route>
                </Switch>
              </div>
            </Theme>
          </Router>
        </QueryClientProvider>
      </StateValueContext.Provider>
    </StateUpdaterContext.Provider>
  );
}

export default App;
