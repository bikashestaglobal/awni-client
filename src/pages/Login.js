import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../config";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { CustomerContext } from "../Routes";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";

import { gapi } from "gapi-script";
const clientId =
  "1041146774583-eogmiftqgbekc7r62uocdrm5gk7uumco.apps.googleusercontent.com";

const Login = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(CustomerContext);

  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    fetch(`${SERVER_URL}/customers/login`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status == 200) {
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });

          // Set data to localstorage
          dispatch({ type: "CUSTOMER", payload: data.body.token });
          localStorage.setItem(
            "customerInfo",
            JSON.stringify({
              ...state,
              jwtToken: data.body.token,
            })
          );

          history.push("/account/myAccount");
        } else if (data.status == 401) {
          toast.success(data.message);
          localStorage.setItem(
            "user",
            JSON.stringify({
              otp: data.body.otp,
              email: data.body.email,
            })
          );
          history.push("/account/otpVerification");
        } else if (data.status == 403) {
          toast.error(data.message, {
            position: toast.POSITION_TOP_RIGHT,
          });
        } else {
          setFormErrors(data.errors);
          setErrorMessage(data.message);
        }
        console.log("Success:", data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
      });
  };

  const onChangeHandler = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const onFocusHandler = (evt) => {
    setFormErrors({ ...formErrors, [evt.target.name]: "" });
    setErrorMessage("");
  };

  const responseFacebook = (response) => {
    const { name, email } = response;

    fetch(`${SERVER_URL}/customers/socialRegistration`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, is_verified: true }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });

          // Set data to localstorage
          dispatch({ type: "CUSTOMER", payload: data.body.token });
          localStorage.setItem(
            "customerInfo",
            JSON.stringify({
              ...state,
              jwtToken: data.body.token,
            })
          );

          history.push("/account/myAccount");
        } else {
          setFormErrors(data.errors);
          setErrorMessage(data.message);
        }
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const responseGoogle = (response) => {
    if (response.profileObj) {
      const { email, name, imageUrl } = response.profileObj;

      fetch(`${SERVER_URL}/customers/socialRegistration`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          image_url: imageUrl,
          is_verified: true,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            toast.success(data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });

            // Set data to localstorage
            dispatch({ type: "CUSTOMER", payload: data.body.token });
            localStorage.setItem(
              "customerInfo",
              JSON.stringify({
                ...state,
                jwtToken: data.body.token,
              })
            );

            history.push("/account/myAccount");
          } else {
            setFormErrors(data.errors);
            setErrorMessage(data.message);
          }
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  // Scroll To Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* breadcrumb-area start */}
      <div
        className="breadcrumb-area section-ptb"
        style={{ background: "url(/assets/images/bg/breadcrumb-bg.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="breadcrumb-title">Login & Register</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Login & Register</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}

      {/* main-content-wrap start */}
      <div className="main-content-wrap section-ptb lagin-and-register-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <div className="login-register-wrapper">
                {/* login-register-tab-list start */}
                <div className="login-register-tab-list nav">
                  <Link className="active" to="/account/login">
                    <h4> login </h4>
                  </Link>
                  <Link to="/account/register">
                    <h4> register </h4>
                  </Link>
                </div>
                {/* login-register-tab-list end */}
                <div className="tab-content">
                  <div id="lg1" className="tab-pane active">
                    <div className="login-form-container">
                      <div className="row">
                        <div className="col-md-6">
                          <img src="/assets/images/login-bg.jpg" />
                        </div>
                        <div className="col-md-6">
                          <div className="LockIcon">
                            <img src="/assets/images/icon-lock.png" />
                          </div>

                          <div className="login-register-form">
                            <div className="login-input-box">
                              <h3 className="mb-2 text-center">
                                <b>Login to Your Account</b>
                              </h3>
                              <p className="text-center">
                                Login using social network
                              </p>
                              <div className="d-flex justify-content-center mb-3">
                                {/* <a
                                  className="btn btn-primary btn-lg btn-floating sc-icon"
                                  style={{ backgroundColor: "#3b5998" }}
                                  href="#!"
                                  role="button"
                                >
                                  <i className="fa fa-facebook"></i>
                                </a> */}
                                <div
                                  className=""
                                  style={{ marginRight: "10px" }}
                                >
                                  <FacebookLogin
                                    appId="704794974175305"
                                    autoLoad={false}
                                    cssClass={
                                      "btn text-light bg-primary btn-lg btn-floating sc-icon mr-4 fb-login"
                                    }
                                    fields="name,email,picture"
                                    onClick={"componentClicked"}
                                    textButton=""
                                    callback={responseFacebook}
                                    icon={"fa-facebook"}
                                    type={"button"}
                                    // icon="fa-facebook"
                                  />
                                </div>
                                <a
                                  className="btn btn-primary btn-lg btn-floating sc-icon"
                                  style={{ backgroundColor: "#00acee" }}
                                  href="#!"
                                  role="button"
                                >
                                  <i className="fa fa-twitter"></i>
                                </a>
                                <GoogleLogin
                                  clientId={clientId}
                                  buttonText="Login"
                                  render={(renderProps) => (
                                    <button
                                      className="btn btn-primary btn-lg btn-floating sc-icon"
                                      style={{ backgroundColor: "#e4252c" }}
                                      onClick={renderProps.onClick}
                                      disabled={renderProps.disabled}
                                    >
                                      <i className="fa fa-google"></i>
                                    </button>
                                  )}
                                  onSuccess={responseGoogle}
                                  onFailure={responseGoogle}
                                  cookiePolicy={"single_host_origin"}
                                />
                              </div>
                              <h3 className="mb-3 text-center">
                                <b>OR</b>
                              </h3>

                              <form onSubmit={submitHandler}>
                                <div className="col-md-12 mb-2">
                                  {errorMessage ? (
                                    <p className="bg-danger p-2 text-light">
                                      {errorMessage}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                  <input
                                    type="text"
                                    onChange={onChangeHandler}
                                    onFocusCapture={onFocusHandler}
                                    name="email"
                                    value={formData.email}
                                    placeholder="Email/Mobile"
                                    className="m-0"
                                  />
                                  {formErrors.email ? (
                                    <p className="form-error">
                                      {formErrors.email}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="col-md-12 mb-2">
                                  <input
                                    type="password"
                                    onChange={onChangeHandler}
                                    onFocusCapture={onFocusHandler}
                                    name="password"
                                    value={formData.password}
                                    placeholder="Pawwsord"
                                    className="m-0"
                                  />
                                  {formErrors.password ? (
                                    <p className="form-error">
                                      {formErrors.password}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="button-box">
                                  <div className="login-toggle-btn">
                                    {/* <input type="checkbox" className="checkB" />
                                    <label>Remember me</label> */}
                                    <Link to="/account/findAccount">
                                      Forgot Password?
                                    </Link>
                                  </div>
                                  <div className="button-box">
                                    <button
                                      className="register-btn btn"
                                      type="submit"
                                      disabled={loading ? true : false}
                                    >
                                      {loading ? (
                                        <div>
                                          <span
                                            className="spinner-grow spinner-grow-sm"
                                            role="status"
                                            aria-hidden="true"
                                          ></span>
                                          &nbsp;
                                          <span> Loading...</span>
                                        </div>
                                      ) : (
                                        <span>Login</span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}
    </>
  );
};

export default Login;
