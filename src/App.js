import $ from "jquery";
import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  // BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import ReactGA from "react-ga";
import {
  PageAboutUs,
  // PageArticles,
  PageCourses,
  PageContact,
  PageHome,
  PageInvestCalculator,
  PageMortgageCalculator,
} from "./Pages";
import { PageCheckoutSuccess } from "./Pages/Checkout/CheckoutPage";
import { Location, Nav, Theme, useWindowBounds } from "./UI";

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

function App({ history }) {
  const [state, updateState] = useState({ value: "check" });
  const { width, height } = useWindowBounds();

  const TRACKING_ID = "G-XSK9C06BSS";
  ReactGA.initialize(TRACKING_ID);

  history.listen((location, action) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });

  return (
    <StateUpdaterContext.Provider value={updateState}>
      <StateValueContext.Provider value={state}>
        <QueryClientProvider client={queryClient}>
          {/* <Router> */}
          <Theme>
            <div
              style={{
                "--windowWidth": `${width}px`,
                "--windowHeight": `${height}px`,
              }}
            >
              <Nav />
              <Location />
              <Switch>
                <Route path="/checkout/success">
                  <PageCheckoutSuccess />
                </Route>
                {/* <Route path="/articles">
                    <PageArticles />
                  </Route> */}
                <Route path="/mortgage-calculator">
                  <PageMortgageCalculator />
                </Route>

                <Route path="/investment-calculator">
                  <PageInvestCalculator />
                </Route>
                <Route path="/courses">
                  <PageCourses />
                </Route>
                <Route path="/about-us">
                  <PageAboutUs />
                </Route>
                <Route path="/contact">
                  <PageContact />
                </Route>
                {/* <Route path="/" exact>
                    <PageHome />
                  </Route> */}
                <Route
                  exact
                  path="/"
                  render={(props) => <PageHome {...props} />}
                />
                <Route
                  render={function () {
                    return (
                      <div style={{ width: "100%", textAlign: "center" }}>
                        <h1 style={{ textAlign: "center" }}>
                          404 - Page Not Found
                        </h1>
                      </div>
                    );
                  }}
                />
              </Switch>
            </div>
          </Theme>
          {/* </Router> */}
        </QueryClientProvider>
      </StateValueContext.Provider>
    </StateUpdaterContext.Provider>
  );
}

export default withRouter(App);
