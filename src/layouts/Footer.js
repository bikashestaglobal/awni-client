import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/Spinner";
import { SERVER_URL } from "../config";
import parse from "html-react-parser";
// Create the function
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = false;
  document.body.appendChild(script);
}

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [contactDetails, setContactDetails] = useState({});
  const [contactDetailsLoading, setContactDetailsLoading] = useState(true);

  // Get All Categoies
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
        toast.warning(error);
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
  return (
    <>
      <footer className="footer-area">
        <div className="footer-top pt--40 pb--100">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-12">
                <div className="footer-info mt--60">
                  <div className="footer-title">
                    <h3>Address</h3>
                  </div>
                  <ul className="footer-info-list contact-us">
                    <li className="d-flex">
                      <i className="ion-ios-location-outline"></i>
                      {parse(contactDetails.address || "") || ""}
                    </li>
                    <li>
                      <i className="ion-ios-email-outline"></i> Email Us :{" "}
                      <a
                        target={"_blank"}
                        href={`mailto:${contactDetails.email}`}
                      >
                        {contactDetails.email || ""}
                      </a>
                    </li>
                    <li>
                      <i className="ion-ios-telephone-outline"></i> Customer
                      Care:{" "}
                      <a
                        target={"_blank"}
                        href={`tel:${contactDetails.customer_care_no}`}
                      >
                        {contactDetails.customer_care_no}
                      </a>
                      <br />
                      &nbsp; &nbsp; &nbsp; &nbsp;Phone:
                      <a
                        target={"_blank"}
                        href={`tel:${contactDetails.mobile_1 || ""}`}
                      >
                        {contactDetails.mobile_1 || ""}
                      </a>
                      /
                      <a
                        target={"_blank"}
                        href={`tel:${contactDetails.mobile_2 || ""}`}
                      >
                        {contactDetails.mobile_2 || ""}
                      </a>
                    </li>
                    <li>
                      <i className="fa fa-whatsapp" aria-hidden="true"></i>
                      <a
                        target={"_blank"}
                        href={`https://wa.me/${contactDetails.whatsapp_no}?text="Hi I am from your website awni.co.in"`}
                      >
                        {contactDetails.whatsapp_no || ""}
                      </a>
                    </li>
                  </ul>
                  <div className="payment-cart">
                    <img src="/assets/images/icon/1.png" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="footer-info mt--60">
                  <div className="footer-title">
                    <h3>Categories</h3>
                  </div>
                  <ul className="footer-list">
                    {categories.map((item, index) => {
                      return (
                        <li key={index}>
                          <Link to={`/${item.slug}`}>{item.name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="footer-info mt--60">
                  <div className="footer-title">
                    <h3>Information</h3>
                  </div>
                  <ul className="footer-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/about">About Us</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact Us</Link>
                    </li>
                    <li>
                      <Link to="/account/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/franchisee">Franchisee</Link>
                    </li>
                    {/*  <li><a href="career.html">Career</a></li>
                                <li><a href="#">Returns & Exchanges</a></li>
                                <li><a href="#">Shipping & Delivery</a></li>
                                <li><a href="#">Privacy Policy</a></li> */}
                  </ul>
                </div>
              </div>
              {/* <div className="col-lg-2 offset-lg-1 col-md-4">
                        <div className="footer-info mt--60">
                            <div className="footer-title">
                                <h3>Quick Links</h3>
                            </div>
                            <ul className="footer-list">
                                <li><a href="#">Store Location</a></li>
                                <li><a href="#">My Account</a></li>
                                <li><a href="#">Orders Tracking</a></li>
                                <li><a href="#">Size Guide</a></li>
                                <li><a href="#">Shopping Rates</a></li>
                                <li><a href="#">Contact Us</a></li>
                            </ul>
                        </div>
                    </div> */}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-6  col-md-6">
                <div className="copyright">
                  <p>Copyright ©All Right Reserved.</p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="footer-social">
                  <ul>
                    {contactDetails.facebook ? (
                      <li>
                        <a
                          href="https://www.facebook.com/awni.bathroom/"
                          target="_blank"
                        >
                          <i className="ion-social-facebook"></i>
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    <li>
                      <a
                        href="https://www.instagram.com/invites/contact/?i=17rvpu5el4w9e&utm_content=nqp3ckt"
                        target="_blank"
                      >
                        <i className="ion-social-instagram-outline"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* footer-area end */}

      {/* Modal-wrapper start */}
      <div className="modal-wrapper">
        <div className="modal fade " id="exampleModalCenter">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                {/* modal-inner-area start */}
                <div className="modal-inner-area row">
                  <div className="col-xl-6 col-lg-7 col-md-6">
                    <div className="product-details-images">
                      <div className="product_details_container">
                        {/* product_big_images start */}
                        <div className="product_big_images-top">
                          <div className="portfolio-full-image tab-content">
                            <div
                              role="tabpanel"
                              className="tab-pane active"
                              id="img-tab-5"
                            >
                              <img
                                src="assets/images/product-details/big-img/w1.html"
                                alt="full-image"
                              />
                            </div>
                            <div
                              role="tabpanel"
                              className="tab-pane product-video-position"
                              id="img-tab-6"
                            >
                              <img
                                src="assets/images/product-details/big-img/w2.jpg"
                                alt="full-image"
                              />
                            </div>
                            <div
                              role="tabpanel"
                              className="tab-pane product-video-position"
                              id="img-tab-7"
                            >
                              <img
                                src="assets/images/product-details/big-img/w3.jpg"
                                alt="full-image"
                              />
                            </div>
                            <div
                              role="tabpanel"
                              className="tab-pane product-video-position"
                              id="img-tab-8"
                            >
                              <img
                                src="assets/images/product-details/big-img/w4.jpg"
                                alt="full-image"
                              />
                            </div>
                            <div
                              role="tabpanel"
                              className="tab-pane product-video-position"
                              id="img-tab-9"
                            >
                              <img
                                src="assets/images/product-details/big-img/w3.jpg"
                                alt="full-image"
                              />
                            </div>
                          </div>
                        </div>
                        {/* product_big_images end */}

                        {/* Start Small images */}
                        <ul
                          className="product_small_images-bottom horizantal-product-active nav"
                          role="tablist"
                        >
                          <li
                            role="presentation"
                            className="pot-small-img active"
                          >
                            <a
                              href="#img-tab-5"
                              role="tab"
                              data-bs-toggle="tab"
                            >
                              <img
                                src="assets/images/product-details/small-img/1.jpg"
                                alt="small-image"
                              />
                            </a>
                          </li>
                          <li role="presentation" className="pot-small-img">
                            <a
                              href="#img-tab-6"
                              role="tab"
                              data-bs-toggle="tab"
                            >
                              <img
                                src="assets/images/product-details/small-img/2.jpg"
                                alt="small-image"
                              />
                            </a>
                          </li>
                          <li role="presentation" className="pot-small-img">
                            <a
                              href="#img-tab-7"
                              role="tab"
                              data-bs-toggle="tab"
                            >
                              <img
                                src="assets/images/product-details/small-img/3.html"
                                alt="small-image"
                              />
                            </a>
                          </li>
                          <li role="presentation" className="pot-small-img">
                            <a
                              href="#img-tab-8"
                              role="tab"
                              data-bs-toggle="tab"
                            >
                              <img
                                src="assets/images/product-details/small-img/4.jpg"
                                alt="small-image"
                              />
                            </a>
                          </li>
                          <li role="presentation" className="pot-small-img">
                            <a
                              href="#img-tab-9"
                              role="tab"
                              data-bs-toggle="tab"
                            >
                              <img
                                src="assets/images/product-details/small-img/3.jpg"
                                alt="small-image"
                              />
                            </a>
                          </li>
                        </ul>
                        {/* End Small images */}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-5 col-md-6">
                    {/* product_details_info start */}
                    <div className="product_details_info">
                      <h2>Black Clock</h2>
                      {/* pro_rating start */}
                      <div className="pro_rating d-flex">
                        <ul className="product-rating d-flex">
                          <li>
                            <span className="icon-star"></span>
                          </li>
                          <li>
                            <span className="icon-star"></span>
                          </li>
                          <li>
                            <span className="icon-star"></span>
                          </li>
                          <li>
                            <span className="icon-star"></span>
                          </li>
                          <li>
                            <span className="icon-star"></span>
                          </li>
                        </ul>
                        <span className="rat_qun"> (Based on 0 Ratings) </span>
                      </div>
                      {/* pro_rating end */}
                      {/* pro_details start */}
                      <div className="pro_details">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit, sed do eiusmod temf incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, nostr
                          exercitation ullamco laboris nisi ut aliquip ex ea.
                        </p>
                      </div>
                      {/* pro_details end */}
                      {/* pro_dtl_prize start */}
                      <ul className="pro_dtl_prize">
                        <li className="old_prize">$15.21</li>
                        <li> $10.00</li>
                      </ul>
                      {/* pro_dtl_prize end */}
                      {/* pro_dtl_color start*/}
                      <div className="pro_dtl_color">
                        <h2 className="title_2">Choose Colour</h2>
                        <ul className="pro_choose_color">
                          <li className="red">
                            <a href="#">
                              <i className="ion-record"></i>
                            </a>
                          </li>
                          <li className="blue">
                            <a href="#">
                              <i className="ion-record"></i>
                            </a>
                          </li>
                          <li className="perpal">
                            <a href="#">
                              <i className="ion-record"></i>
                            </a>
                          </li>
                          <li className="yellow">
                            <a href="#">
                              <i className="ion-record"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                      {/* pro_dtl_color end*/}
                      {/* pro_dtl_size start */}
                      <div className="pro_dtl_size">
                        <h2 className="title_2">Size</h2>
                        <ul className="pro_choose_size">
                          <li>
                            <a href="#">S</a>
                          </li>
                          <li>
                            <a href="#">M</a>
                          </li>
                          <li>
                            <a href="#">XL</a>
                          </li>
                          <li>
                            <a href="#">XXL</a>
                          </li>
                        </ul>
                      </div>
                      {/* pro_dtl_size end */}
                      {/* product-quantity-action start */}
                      <div className="product-quantity-action">
                        <div className="prodict-statas">
                          <span>Quantity :</span>
                        </div>
                        <div className="product-quantity">
                          <form action="#">
                            <div className="product-quantity">
                              <div className="cart-plus-minus">
                                <input
                                  type="text"
                                  value="01"
                                  name="qtybutton"
                                  className="cart-plus-minus-box"
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      {/* product-quantity-action end */}
                      {/* pro_dtl_btn start */}
                      <ul className="pro_dtl_btn">
                        <li>
                          <a href="#" className="buy_now_btn">
                            buy now
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="ion-heart"></i>
                          </a>
                        </li>
                      </ul>
                      {/* pro_dtl_btn end */}
                      {/* pro_social_share start */}
                      <div className="pro_social_share d-flex">
                        <h2 className="title_2">Share :</h2>
                        <ul className="pro_social_link">
                          {/*  <li><a href="#"><i className="ion-social-twitter"></i></a></li>
                                            <li><a href="#"><i className="ion-social-tumblr"></i></a></li> */}
                          <li>
                            <a
                              href="https://www.facebook.com/awni.bathroom/"
                              target="_blank"
                            >
                              <i className="ion-social-facebook"></i>
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.instagram.com/invites/contact/?i=17rvpu5el4w9e&utm_content=nqp3ckt"
                              target="_blank"
                            >
                              <i className="ion-social-instagram-outline"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                      {/* pro_social_share end */}
                    </div>
                    {/* product_details_info end */}
                  </div>
                </div>
                {/* modal-inner-area end */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
