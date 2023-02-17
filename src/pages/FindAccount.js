import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../config";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../components/Alert";

const FindAccount = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    fetch(`${SERVER_URL}/customers/findAccount`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status == 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: data.body.email,
              id: data.body.id,
              name: data.body.name,
              otp: Number(data.body.otp) * 2,
            })
          );
          history.push("/account/enterOtp");
        } else {
          setFormErrors(data.errors);
          toast.error(data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error);
        console.error("Error:", error);
      });
  };

  const onChangeHandler = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const onFocusHandler = (evt) => {
    setFormErrors({ ...formErrors, [evt.target.name]: "" });
  };

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
                                <b>Find Your Account</b>
                              </h3>

                              <form onSubmit={submitHandler}>
                                <div className="row">
                                  <div className="col-md-12 mb-2">
                                    <input
                                      type="text"
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="email"
                                      value={formData.email}
                                      placeholder="Enter Your Email"
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
                                      <span>Find Account</span>
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

export default FindAccount;
