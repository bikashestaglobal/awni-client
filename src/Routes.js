import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { initialState, customerReducer } from "./reducer/CustomerReducer";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import ProductDetails from "./pages/ProductDetails";
import Listing from "./pages/Listing";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import OtpVerifiction from "./pages/OtpVerifiction";
import FindAccount from "./pages/FindAccount";
import ForgetPasswordOtpVerification from "./pages/ForgetPasswordOtpVerification";
import CreateNewPassword from "./pages/CreateNewPassword";

// Create Context
export const CustomerContext = createContext();

const Routing = () => {
  return (
    <Switch>
      <Route exact path={"/"} component={Home} />
      <Route exact path={"/about"} component={About} />
      <Route exact path={"/contact"} component={Contact} />
      <Route exact path={"/product/:slug"} component={ProductDetails} />
      <Route exact path={"/account/login"} component={Login} />

      {/* Forget Password */}
      <Route exact path={"/account/findAccount"} component={FindAccount} />
      <Route
        exact
        path={"/account/enterOtp"}
        component={ForgetPasswordOtpVerification}
      />
      <Route
        exact
        path={"/account/createNewPassword"}
        component={CreateNewPassword}
      />

      {/* Forget Password End */}

      <Route exact path={"/account/register"} component={Register} />
      <Route exact path={"/account/myAccount"} component={MyAccount} />
      <Route
        exact
        path={"/account/otpVerification"}
        component={OtpVerifiction}
      />
      <Route
        exact
        path={"/:parCatSlug/:subCatSlug?/:childCatSlug?"}
        component={Listing}
      />
      <Route exact path={"/*"} component={ProductDetails} />
    </Switch>
  );
};

const Routes = () => {
  const [state, dispatch] = useReducer(customerReducer, initialState);
  return (
    <div id="main-wrapper">
      <CustomerContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <Header />
          <Routing />
          <Footer />
        </Router>
      </CustomerContext.Provider>
    </div>
  );
};

export default Routes;
