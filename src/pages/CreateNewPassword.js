import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../config";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../components/Alert";

const CreateNewPassword = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    // Check Both Password is correct or not
    if (formData.newPassword == "" || formData.confirmPassword == "") {
      toast.warning("Please fill the Form");
      setFormErrors({ ...formErrors, confirmPassword: "Please fill the Form" });
      setLoading(false);
      return;
    }

    if (formData.newPassword != formData.confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: "Confirm Password is Wrong",
      });
      setLoading(false);
      toast.warning("Confirm Password is Wrong");
      return;
    }

    // Get User
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Somthing went wrong !");
      return;
    }

    fetch(`${SERVER_URL}/customers/createNewPassword/${user.id}`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: formData.newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status == 200) {
          toast.success(data.message);
          history.push("/account/login");
        } else {
          if (data.errors.password) {
            toast.error(data.errors.password);
          }
          toast.error(data.message);
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
    setFormErrors({ ...formErrors, confirmPassword: "" });
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
                                <b>Create New Password</b>
                              </h3>

                              <form onSubmit={submitHandler}>
                                <div className="row">
                                  <div className="col-md-12 mb-2">
                                    {formErrors.confirmPassword ? (
                                      <Alert
                                        className={"alert-danger"}
                                        text={formErrors.confirmPassword}
                                      />
                                    ) : (
                                      ""
                                    )}
                                    <input
                                      type="password"
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="newPassword"
                                      value={formData.newPassword}
                                      placeholder="New Password"
                                      className="m-0"
                                    />
                                    <input
                                      type="password"
                                      onChange={onChangeHandler}
                                      onFocusCapture={onFocusHandler}
                                      name="confirmPassword"
                                      value={formData.confirmPassword}
                                      placeholder="Confirm Password"
                                      className="m-0 mt-2"
                                    />
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
                                      <span>Create Password</span>
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

export default CreateNewPassword;
