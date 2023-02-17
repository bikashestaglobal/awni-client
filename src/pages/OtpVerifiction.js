import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../config";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../components/Alert";

const OtpVerification = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    otp: "",
  });
  const [formErrors, setFormErrors] = useState({
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    // Verify OTP
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Somthing went wrong !");
      setLoading(false);
      return;
    }
    if (formData.otp != Number(user.otp) / 2) {
      setFormErrors({ otp: "Please Enter correct OTP" });
      setLoading(false);
      return;
    }

    fetch(`${SERVER_URL}/customers/verify`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status == 200) {
          toast.success(data.message + " Please Login", {
            position: toast.POSITION.TOP_RIGHT,
          });
          history.push("/account/login");
        } else {
          setFormErrors(data.errors);
          toast.error(data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
      });
  };

  const resendOTPHandler = (evt) => {
    setOtpLoading(true);
    evt.preventDefault();

    // Verify OTP
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Somthing went wrong !");
      setOtpLoading(false);
      return;
    }

    fetch(`${SERVER_URL}/customers/resendOTP`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        otp: Number(user.otp) / 2,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOtpLoading(false);
        toast.success(data.message);
      })
      .catch((error) => {
        setOtpLoading(false);
        toast.success(error);
      });
  };

  const onChangeHandler = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const onFocusHandler = (evt) => {
    setFormErrors({ ...formErrors, [evt.target.name]: "" });
  };

  // Scroll To Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* breadcrumb-area start */}
      {/* <div
        className="breadcrumb-area section-ptb"
        style={{ background: "url(/assets/images/bg/breadcrumb-bg.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="breadcrumb-title">Login & Register</h2>
              
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Login & Register</li>
              </ul>
              
            </div>
          </div>
        </div>
      </div> */}
      {/* breadcrumb-area end */}

      {/* main-content-wrap start */}
      <div className="main-content-wrap section-ptb lagin-and-register-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <div className="login-register-wrapper">
                {/* login-register-tab-list start */}
                {/* <div className="login-register-tab-list nav">
                  <Link to="/account/login">
                    <h4> login </h4>
                  </Link>
                  <Link className="active" to="/account/register">
                    <h4> register </h4>
                  </Link>
                </div> */}
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
                                <b>OTP Verification</b>
                              </h3>

                              <form onSubmit={submitHandler}>
                                <div className="row">
                                  <div className="col-md-12 mb-2">
                                    <Alert
                                      className={"alert-success"}
                                      text={"OTP Send on your Mail !!"}
                                    />
                                    <input
                                      type="text"
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="otp"
                                      value={formData.otp}
                                      placeholder="Enter OTP"
                                      className="m-0"
                                    />
                                    {formErrors.otp ? (
                                      <p className="form-error">
                                        {formErrors.otp}
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>

                                <div className="button-box">
                                  <div className="login-toggle-btn">
                                    {/* <input type="checkbox" className="checkB" />
                                    <label>Remember me</label> */}
                                    <Link
                                      disabled={otpLoading ? true : false}
                                      to=""
                                      onClick={resendOTPHandler}
                                    >
                                      {otpLoading ? (
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
                                        <span>Resend OTP?</span>
                                      )}
                                    </Link>
                                  </div>
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
                                      <span>Verify</span>
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

export default OtpVerification;
