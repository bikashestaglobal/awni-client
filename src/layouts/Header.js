import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import { SERVER_URL } from "../config";
import { CustomerContext } from "../Routes";

// Create the function
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = false;
  document.body.appendChild(script);
}

const Header = () => {
  const history = useHistory();

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const { state, dispatch } = useContext(CustomerContext);

  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const [contactDetails, setContactDetails] = useState({});
  const [contactDetailsLoading, setContactDetailsLoading] = useState(true);
  const [pathname, setPathname] = useState("");

  // Get All Parent with sub Categoies
  useEffect(() => {
    setCategoryLoading(true);
    fetch(`${SERVER_URL}/parentCategories/allSubCategories`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategoryLoading(false);
        if (data.status == 200) {
          setCategories(data.body || []);
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setCategoryLoading(false);
        toast.error(error);
      });
  }, []);

  // Get All Parent with Sub Categoies
  useEffect(() => {
    fetch(`${SERVER_URL}/parentCategories/allChildCategories`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setCategories(data.body || []);
        } else {
          toast.warning(data.message);
        }
        console.log("All Child Category:", data);
      })
      .catch((error) => {
        toast.error(error);
      });
  }, []);

  // Get Contact Us details
  useEffect(() => {
    setContactDetailsLoading(true);
    fetch(`${SERVER_URL}/contactUs/`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setContactDetailsLoading(false);
        if (data.status == 200) {
          setContactDetails(data.body || []);
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setContactDetailsLoading(false);
        toast.warning(error);
      });
  }, []);

  useEffect(() => {
    if (customerInfo && customerInfo.jwtToken) {
      dispatch({ type: "CUSTOMER", payload: customerInfo });
    }
  }, []);

  // For the active page
  useEffect(() => {
    const path = history.location.pathname.split("/");
    setPathname(`/${path[1]}`);
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="header-area sticky-top">
        {/* header-top start */}
        <div className="header-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-8">
                <div
                  className="language-currency-wrapper"
                  style={{ justifyContent: "flex-start" }}
                >
                  <ul>
                    <li className="drodown-show">
                      {contactDetailsLoading ? (
                        <Spinner />
                      ) : (
                        <a
                          href={`mailto:${contactDetails.email}`}
                          target={"_blank"}
                        >
                          <i className="fa fa-envelope mr-2"></i>
                          {contactDetails.email}
                        </a>
                      )}
                    </li>
                    <li className="drodown-show">
                      {contactDetailsLoading ? (
                        <Spinner />
                      ) : (
                        <a
                          target="_blank"
                          href={`tel:${contactDetails.customer_care_no}`}
                        >
                          <i className="fa fa-phone"></i>
                          Customer Care: {contactDetails.customer_care_no}
                        </a>
                      )}
                    </li>
                    <li className="drodown-show">
                      {contactDetailsLoading ? (
                        <Spinner />
                      ) : (
                        <a
                          target={"_blank"}
                          href={`https://wa.me/${contactDetails.whatsapp_no}?text="Hi I am from your website awni.co.in"`}
                        >
                          <i className="fa fa-whatsapp" aria-hidden="true"></i>
                          {contactDetails.whatsapp_no}
                        </a>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                {/* language-currency-wrapper start */}
                <div className="language-currency-wrapper">
                  <ul>
                    <li className="drodown-show">
                      <Link
                        to={
                          state && state.jwtToken
                            ? "/account/myAccount"
                            : "/account/login"
                        }
                      >
                        <i className="fa fa-user" aria-hidden="true"></i>
                      </Link>
                    </li>
                    {contactDetails.facebook ? (
                      <li className="drodown-show">
                        <a href={contactDetails.facebook} target="_blank">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                    ) : (
                      ""
                    )}

                    {contactDetails.instagram ? (
                      <li className="drodown-show">
                        <a href={contactDetails.instagram} target="_blank">
                          <i className="fa fa-instagram"></i>
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {contactDetails.twitter ? (
                      <li className="drodown-show">
                        <a href={contactDetails.twitter} target="_blank">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {contactDetails.linkedin ? (
                      <li className="drodown-show">
                        <a href={contactDetails.linkedin} target="_blank">
                          <i className="fa fa-linkedin"></i>
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>
                {/* language-currency-wrapper end */}
              </div>
            </div>
          </div>
        </div>
        {/* header-top end */}
        <div className="header-bottom-area header-sticky">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 d-none d-lg-block">
                <div className="main-menu-area text-center">
                  <nav className="main-navigation">
                    <ul>
                      <li className={pathname == "/" ? "active" : ""}>
                        <Link onClick={(evt) => setPathname("/")} to="/">
                          Home
                        </Link>
                      </li>

                      <li className={pathname == "/about" ? "active" : ""}>
                        <Link
                          onClick={(evt) => setPathname("/about")}
                          to="/about"
                        >
                          About
                        </Link>
                      </li>
                      {categoryLoading ? (
                        <Spinner />
                      ) : categories.length ? (
                        categories.map((cat, index) => {
                          return (
                            <li
                              className={pathname == cat.slug ? "active" : ""}
                            >
                              <Link to={`#`}>{cat.name}</Link>

                              {cat.subCategories.length ? (
                                <ul className="sub-menu">
                                  {cat.subCategories.map((subCat, i) => {
                                    return (
                                      <li key={i}>
                                        <Link
                                          onClick={(evt) =>
                                            setPathname(cat.slug)
                                          }
                                          to={`/${cat.slug}/${subCat.slug}`}
                                        >
                                          {subCat.name}
                                        </Link>

                                        {/* Child Menu */}

                                        {subCat.childCategories ? (
                                          subCat.childCategories.length ? (
                                            <ul className="sub-menu2">
                                              {subCat.childCategories.map(
                                                (childCat, index) => {
                                                  return (
                                                    <Link
                                                      onClick={(evt) =>
                                                        setPathname(cat.slug)
                                                      }
                                                      key={index}
                                                      to={`/${cat.slug}/${subCat.slug}/${childCat.slug}`}
                                                    >
                                                      {childCat.name}
                                                    </Link>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                ""
                              )}
                            </li>
                          );
                        })
                      ) : (
                        <span className="text-danger">Not Available</span>
                      )}

                      {/*  <li><Link to="#">Blog</Link></li> */}

                      <li className={pathname == "/contact" ? "active" : ""}>
                        <Link
                          onClick={(evt) => setPathname("/contact")}
                          to="/contact"
                        >
                          Contact us
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-lg-1 col-md-1">
                <div className="right-blok-box d-flex">
                  {/* <div className="search-wrap">
                    <Link to="#" className="trigger-search">
                      <i className="icon-magnifier"></i>
                    </Link>
                  </div> */}
                </div>
              </div>
              <div className="col-lg-2 col-md-2">
                <div className="logo">
                  <Link to="/">
                    <img
                      style={{
                        height: "35px",
                        width: "120px",
                      }}
                      src="/assets/images/logo/logo.png"
                      alt=""
                    />
                  </Link>
                </div>
              </div>
              <div className="col">
                <div className="mobile-menu d-block d-lg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* header-area end */}

      {/* main-search start */}
      <div className="main-search-active">
        <div className="sidebar-search-icon">
          <button className="search-close">
            <span className="icon-close"></span>
          </button>
        </div>
        <div className="sidebar-search-input">
          <form>
            <div className="form-search">
              <input
                id="search"
                className="input-text"
                value=""
                placeholder="Search entire store here ..."
                type="search"
              />
              <button className="search-btn" type="button">
                <i className="icon-magnifier"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      {/*main-search start */}
      {AddLibrary("/assets/js/vendor/jquery-3.5.1.min.js")}
      {AddLibrary("/assets/js/vendor/jquery-migrate-3.3.0.min.js")}
      {AddLibrary("/assets/js/popper.min.js")}
      {AddLibrary("/assets/js/bootstrap.min.js")}
      {AddLibrary("/assets/js/plugins.js")}
      {AddLibrary("/assets/js/ajax-mail.js")}
      {AddLibrary("/assets/js/main.js")}
    </>
  );
};

export default Header;
