import React, { useEffect, useContext, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { SERVER_URL } from "../config";
import { CustomerContext } from "../Routes";
import date from "date-and-time";

const MyAccount = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const history = useHistory();
  const [profile, setProfile] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address_1: "",
    address_2: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    password: "",
  });

  const [password, setPassword] = useState(undefined);
  const [profileLoading, setProfileLoading] = useState(false);
  const [allWishlistLoading, setAllWishlistLoading] = useState(false);
  const [allWishlists, setAllWishlists] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [removeWishlistLoading, setRemoveWishlistLoading] = useState(false);
  const [removedFromWishlist, setRemovedFromWishlist] = useState(false);

  useEffect(() => {
    if (!customerInfo) {
      history.push("/account/login");
    }

    if (customerInfo && !customerInfo.jwtToken) {
      history.push("/account/login");
    }
  }, []);

  // Get Profile
  useEffect(() => {
    setProfileLoading(true);
    fetch(`${SERVER_URL}/customers/myProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setProfileLoading(false);
          if (result.status == 200) {
            setCustomer({
              ...result.body,
            });
            setProfile({
              name: result.body.name,
              image_url: result.body.image_url,
              mobile: result.body.mobile,
              email: result.body.email,
            });
          } else {
            toast.error(result.message);
            console.log(result);
          }
        },
        (error) => {
          setProfileLoading(false);
          toast.error(error);
          console.log(error);
        }
      );
  }, []);

  // Logout Function
  const logout = (evt) => {
    evt.preventDefault();
    localStorage.removeItem("customerInfo");
    dispatch({ type: "CLEAR" });
    toast.success("Successfully Logout !!");
    history.push("/account/login");
  };

  // Get Wishlists
  useEffect(() => {
    setAllWishlistLoading(true);
    fetch(`${SERVER_URL}/wishlists/myWishlists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setAllWishlistLoading(false);
          if (result.status == 200) {
            setAllWishlists(result.body || []);
            // console.log(result.body);
          } else {
            toast.error(result.message);
            // console.log(result);
          }
        },
        (error) => {
          setAllWishlistLoading(false);
          toast.error(error);
          // console.log(error);
        }
      );
  }, [removedFromWishlist]);

  // Remove Product to Wishlist
  const removeWidhlistHandler = (evt, id) => {
    evt.preventDefault();
    setRemoveWishlistLoading(true);
    fetch(`${SERVER_URL}/wishlists/${id}`, {
      method: "DELETE", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRemoveWishlistLoading(false);
        if (data.status == 200) {
          toast.success(data.message);
          setRemovedFromWishlist(!removedFromWishlist);
        } else {
          toast.warning(data.message);
        }
      })
      .catch((error) => {
        setRemoveWishlistLoading(false);
        toast.error(error);
      });
  };

  const updateSubmitHandler = (evt) => {
    const updateData = {
      name: customer.name,
      mobile: customer.mobile,
      address_1: customer.address_1,
      address_2: customer.address_2,
      country: customer.country,
      state: customer.state,
      city: customer.city,
      pincode: customer.pincode,
      password: password,
    };

    evt.preventDefault();
    setUpdateLoading(true);
    fetch(`${SERVER_URL}/customers/updateProfile`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setUpdateLoading(false);

          if (result.status == 200) {
            setCustomer({
              ...result.body,
            });
            setProfile({
              name: result.body.name,
              mobile: result.body.mobile,
              email: result.body.email,
            });
            toast.success(result.message);
          } else {
            const errors = result.errors;
            const keys = Object.keys(errors);
            for (let k of keys) {
              toast.error(errors[k]);
            }
            // console.log(result);
          }
        },
        (error) => {
          setUpdateLoading(false);
          toast.error(error);
          console.log(error);
        }
      );
  };

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
              <h2 className="breadcrumb-title">My Account</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">My Account</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}

      {/* main-content-wrap start */}
      <div class="main-content-wrap section-ptb my-account-page">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="account-dashboard">
                <div class="row">
                  <div class="col-md-12 col-lg-2">
                    {/* Nav tabs */}
                    <ul role="tablist" class="nav flex-column dashboard-list">
                      <li class="active">
                        <a
                          href="#dashboard"
                          data-bs-toggle="tab"
                          class="nav-link active"
                        >
                          My Profile
                        </a>
                      </li>
                      <li>
                        <a href="#orders" data-bs-toggle="tab" class="nav-link">
                          My Wishlist
                        </a>
                      </li>
                      {/* <li><a href="#downloads" data-bs-toggle="tab" class="nav-link">Downloads</a></li>
                                    <li><a href="#address" data-bs-toggle="tab" class="nav-link">Addresses</a></li>
                                    <li><a href="#account-details" data-bs-toggle="tab" class="nav-link">Account details</a></li> */}
                      <li>
                        <Link to="#" onClick={logout} class="nav-link">
                          logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div class="col-md-12 col-lg-10">
                    {/* Tab panes */}
                    {profileLoading ? (
                      <div className="row">
                        <div className="col-md-12 text-center">
                          <Spinner />
                        </div>
                      </div>
                    ) : (
                      <div class="tab-content dashboard-content">
                        <div class="tab-pane active" id="dashboard">
                          <h3>My Profile </h3>
                          <div class="row">
                            <div class="col-md-4 text-center">
                              <div class="speaker-content-box">
                                <div class="ProfImg">
                                  <img
                                    style={{ height: "100%", width: "100%" }}
                                    src={
                                      profile.image_url ||
                                      "https://monstar-lab.com/global/wp-content/uploads/sites/11/2019/04/male-placeholder-image.jpeg"
                                    }
                                  />
                                </div>

                                <h4 class="speaker-name text-dark mb-0 mt-3 mb-1">
                                  <b>{profile.name || ""}</b>
                                </h4>
                                {profile.email ? (
                                  <p class="speaker-designation mb-1">
                                    <i
                                      class="fa fa-envelope"
                                      aria-hidden="true"
                                    ></i>
                                    {" " + profile.email || ""}
                                  </p>
                                ) : (
                                  ""
                                )}
                                {profile.mobile ? (
                                  <p class="mb-0">
                                    <i
                                      class="fa fa-phone"
                                      aria-hidden="true"
                                    ></i>
                                    {profile.mobile || ""}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div class="col-md-8">
                              {/* <span class="view editdiv">edit</span> */}

                              <div class="editbox" style={{ display: "block" }}>
                                <div class="contact-form-warp2 mt-0">
                                  <div class="title">
                                    <h3>Edit Profile Details</h3>
                                  </div>
                                  <form
                                    id="contact-form"
                                    onSubmit={updateSubmitHandler}
                                  >
                                    <div class="row">
                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="name"
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              name: evt.target.value,
                                            });
                                          }}
                                          value={customer.name}
                                          placeholder="Your Name*"
                                        />
                                      </div>

                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="mobile"
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              mobile: evt.target.value,
                                            });
                                          }}
                                          value={customer.mobile}
                                          placeholder="Mobile No"
                                        />
                                      </div>
                                      {/* <div class="col-lg-6">
                                        <input
                                          type="email"
                                          name="email"
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              email: evt.target.value,
                                            });
                                          }}
                                          value={customer.email}
                                          placeholder="Email"
                                        />
                                      </div> */}
                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="address_1"
                                          value={customer.address_1}
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              address_1: evt.target.value,
                                            });
                                          }}
                                          placeholder="Address 1"
                                        />
                                      </div>
                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="address_2"
                                          value={customer.address_2}
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              address_2: evt.target.value,
                                            });
                                          }}
                                          placeholder="Address 2"
                                        />
                                      </div>

                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="country"
                                          value={customer.country}
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              country: evt.target.value,
                                            });
                                          }}
                                          placeholder="country"
                                        />
                                      </div>

                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="state"
                                          value={customer.state}
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              state: evt.target.value,
                                            });
                                          }}
                                          placeholder="state"
                                        />
                                      </div>
                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="city"
                                          value={customer.city}
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              city: evt.target.value,
                                            });
                                          }}
                                          placeholder="city"
                                        />
                                      </div>
                                      <div class="col-lg-6">
                                        <input
                                          type="text"
                                          name="pincode"
                                          value={customer.pincode}
                                          onChange={(evt) => {
                                            setCustomer({
                                              ...customer,
                                              pincode: evt.target.value,
                                            });
                                          }}
                                          placeholder="pincode"
                                        />
                                      </div>

                                      <div class="col-lg-12">
                                        <input
                                          type="text"
                                          name="name"
                                          onChange={(evt) => {
                                            setPassword(evt.target.value);
                                          }}
                                          placeholder="Change Password"
                                          value={password}
                                        />
                                      </div>
                                      {/* <div class="col-lg-12">
                                        <textarea name="message" placeholder="Address*" style="height: 120px;"></textarea>
                                    </div> */}
                                    </div>
                                    <div class="contact-submit-btn">
                                      <button
                                        type="submit"
                                        class="submit-btn"
                                        disabled={updateLoading ? true : false}
                                      >
                                        {updateLoading ? (
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
                                          <span>Update</span>
                                        )}
                                      </button>
                                      <p class="form-messege"></p>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="tab-pane fade" id="orders">
                          <div class="row">
                            <div class="col-md-6">
                              <h3>My Wishlist</h3>
                            </div>
                            <div class="col-md-6">
                              <span class="total">
                                Total Price:
                                {allWishlists.reduce((sum, current) => {
                                  return sum + current.selling_price;
                                }, 0)}
                              </span>
                            </div>
                          </div>
                          <div class=" table-content table-responsive">
                            {allWishlistLoading ? (
                              <Spinner />
                            ) : allWishlists.length ? (
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th class="plantmore-product-thumbnail">
                                      Date
                                    </th>
                                    <th class="plantmore-product-thumbnail">
                                      images
                                    </th>
                                    <th class="cart-product-name">Product</th>
                                    <th class="plantmore-product-price">
                                      Price
                                    </th>
                                    {/* <th class="plantmore-product-stock-status">
                                    Stock Status
                                  </th> */}
                                    <th class="plantmore-product-add-cart">
                                      View Product
                                    </th>
                                    <th class="plantmore-product-remove">
                                      remove
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allWishlistLoading ? (
                                    <Spinner />
                                  ) : (
                                    allWishlists.map((item, index) => {
                                      return (
                                        <tr>
                                          <td class="plantmore-product-name text-danger">
                                            {date.format(
                                              new Date(item.created_at),
                                              "DD-MM-YYYY"
                                            )}
                                          </td>
                                          <td class="plantmore-product-thumbnail">
                                            <Link to={`/product/${item.slug}`}>
                                              <img
                                                src={item.default_image}
                                                alt=""
                                              />
                                            </Link>
                                          </td>
                                          <td class="plantmore-product-name">
                                            <Link to={`/product/${item.slug}`}>
                                              {item.product_name}
                                            </Link>
                                          </td>
                                          <td class="plantmore-product-price">
                                            <span class="amount fa fa-inr">
                                              {item.selling_price}
                                            </span>
                                          </td>
                                          {/* <td class="plantmore-product-stock-status">
                                          <span class="in-stock">in stock</span>
                                        </td> */}
                                          <td class="plantmore-product-add-cart">
                                            <Link to={`/product/${item.slug}`}>
                                              View
                                            </Link>
                                          </td>
                                          <td class="plantmore-product-remove">
                                            <Link
                                              href="#"
                                              onClick={(evt) => {
                                                removeWidhlistHandler(
                                                  evt,
                                                  item.product_id
                                                );
                                              }}
                                            >
                                              <i class="ion-close"></i>
                                            </Link>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            ) : (
                              <div className="alert alert-danger">
                                Wishlist is Empty
                              </div>
                            )}
                          </div>
                        </div>
                        <div class="tab-pane fade" id="downloads">
                          <h3>Downloads</h3>
                          <div class="table-responsive">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Downloads</th>
                                  <th>Expires</th>
                                  <th>Download</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Haven - Free Real Estate PSD Template</td>
                                  <td>May 10, 2018</td>
                                  <td>never</td>
                                  <td>
                                    <a href="#" class="view">
                                      Click Here To Download Your File
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Nevara - ecommerce html template</td>
                                  <td>Sep 11, 2018</td>
                                  <td>never</td>
                                  <td>
                                    <a href="#" class="view">
                                      Click Here To Download Your File
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="tab-pane" id="address">
                          <p>
                            The following addresses will be used on the checkout
                            page by default.
                          </p>
                          <div class="row">
                            <div class="col-md-6">
                              <h4 class="billing-address">Billing address</h4>
                              <span class="view editdiv">edit</span>
                              <p class="biller-name">
                                3522 Interstate
                                <br />
                                75 Business Spur,
                                <br />
                                Sault Ste. Marie, MI 49783 New York
                              </p>
                            </div>

                            <div class="col-md-6">
                              <h4 class="billing-address">Shipping Address</h4>
                              <span class="view editdiv2">edit</span>
                              <p class="biller-name">
                                3522 Interstate
                                <br />
                                75 Business Spur,
                                <br />
                                Sault Ste. Marie, MI 49783 New York
                              </p>
                            </div>
                          </div>

                          <div class="editbox2" style={{ display: "block" }}>
                            <div class="contact-form-warp2">
                              <div class="title">
                                <h3>Shipping Address</h3>
                              </div>
                              <form id="contact-form" action="#" method="post">
                                <div class="row">
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="name"
                                      placeholder="Your Name*"
                                    />
                                  </div>
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="country"
                                      placeholder="country"
                                    />
                                  </div>
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="address"
                                      placeholder="Street Address"
                                    />
                                  </div>
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="town"
                                      placeholder="Town / City"
                                    />
                                  </div>
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="state"
                                      placeholder="State"
                                    />
                                  </div>
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="zip"
                                      placeholder="Postal Zip"
                                    />
                                  </div>
                                </div>
                                <div class="contact-submit-btn">
                                  <button type="submit" class="submit-btn">
                                    Save
                                  </button>
                                  <p class="form-messege"></p>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div class="tab-pane fade" id="account-details">
                          <h3>Account details </h3>
                          <div class="login">
                            <div class="login-form-container">
                              <div class="account-login-form">
                                <form action="#">
                                  <h3>
                                    Already have an account?
                                    <a href="#">Log in instead!</a>
                                  </h3>
                                  <label>Social title</label>
                                  <div class="input-radio">
                                    <span class="custom-radio">
                                      <input
                                        type="radio"
                                        value="1"
                                        name="id_gender"
                                      />
                                      Mr.
                                    </span>
                                    <span class="custom-radio">
                                      <input
                                        type="radio"
                                        value="1"
                                        name="id_gender"
                                      />
                                      Mrs.
                                    </span>
                                  </div>
                                  <div class="account-input-box">
                                    <label>First Name</label>
                                    <input type="text" name="first-name" />
                                    <label>Last Name</label>
                                    <input type="text" name="last-name" />
                                    <label>Email</label>
                                    <input type="text" name="email-name" />
                                    <label>Password</label>
                                    <input
                                      type="password"
                                      name="user-password"
                                    />
                                    <label>Birthdate</label>
                                    <input
                                      type="text"
                                      placeholder="MM/DD/YYYY"
                                      value=""
                                      name="birthday"
                                    />
                                  </div>
                                  <div class="example">(E.g.: 05/31/1970)</div>
                                  <div class="custom-checkbox">
                                    <input
                                      type="checkbox"
                                      value="1"
                                      name="optin"
                                    />
                                    <label>
                                      Receive offers from our partners
                                    </label>
                                  </div>
                                  <div class="custom-checkbox">
                                    <input
                                      type="checkbox"
                                      value="1"
                                      name="newsletter"
                                    />
                                    <label>
                                      Sign up for our newsletter
                                      <br />
                                      <em>
                                        You may unsubscribe at any moment. For
                                        that purpose, please find our contact
                                        info in the legal notice.
                                      </em>
                                    </label>
                                  </div>
                                  <div class="button-box">
                                    <button
                                      class="btn default-btn"
                                      type="submit"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

export default MyAccount;
