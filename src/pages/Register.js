import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../config";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import { CustomerContext } from "../Routes";
import { gapi } from "gapi-script";
const clientId =
  "1041146774583-eogmiftqgbekc7r62uocdrm5gk7uumco.apps.googleusercontent.com";

const Register = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(CustomerContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    fetch(`${SERVER_URL}/customers/register`, {
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
          localStorage.setItem(
            "user",
            JSON.stringify({
              otp: data.body.otp,
              email: data.body.email,
            })
          );
          history.push("/account/otpVerification");
        } else if (data.status == 401) {
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              otp: data.body.otp,
              email: data.body.email,
              name: data.body.name,
            })
          );
          history.push("/account/otpVerification");
        } else if (data.status == 302) {
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          history.push("/account/login");
        } else {
          setFormErrors(data.errors);
        }
        // console.log("Success:", data);
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
      // console.log("Google Response: ", response.profileObj);

      fetch(`${SERVER_URL}/customers/socialRegistration`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          is_verified: true,
          image_url: imageUrl,
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

  // Initialize the google api
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
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
                  <Link to="/account/login">
                    <h4> login </h4>
                  </Link>
                  <Link className="active" to="/account/register">
                    <h4> register </h4>
                  </Link>
                </div>
                {/* login-register-tab-list end */}
                <div className="tab-content">
                  <div id="lg2" className="tab-pane active">
                    <div className="login-form-container p-0">
                      <div className="row">
                        <div className="col-md-6 pt-5">
                          <img src="/assets/images/Checklist.jpg" />
                        </div>

                        <div className="col-md-6">
                          <div className="login-register-form">
                            <div className="login-input-box mb-5 mt-5">
                              <h3 className="mb-2 text-center">
                                <b>Register Your Account</b>
                              </h3>
                              <p className="text-center">
                                Login using social network
                              </p>
                              <div className="d-flex justify-content-center mb-3">
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
                                <div className="row">
                                  <div className="col-md-6 mb-2">
                                    <input
                                      type="text"
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="name"
                                      value={formData.name}
                                      placeholder="Name"
                                      className="m-0"
                                    />
                                    {formErrors.name ? (
                                      <p className="form-error">
                                        {formErrors.name}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="col-md-6 mb-2">
                                    <input
                                      type="text"
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="mobile"
                                      value={formData.mobile}
                                      placeholder="Mobile No"
                                      className="m-0"
                                    />
                                    {formErrors.mobile ? (
                                      <p className="form-error">
                                        {formErrors.mobile}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="col-md-6 mb-2">
                                    <input
                                      type="text"
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="email"
                                      value={formData.email}
                                      placeholder="Email"
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
                                  <div className="col-md-6 mb-2">
                                    <input
                                      type="password"
                                      value={formData.password}
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="password"
                                      placeholder="Password"
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
                                      <span>Register</span>
                                    )}
                                  </button>
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

export default Register;
