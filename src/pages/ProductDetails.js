import React, { useEffect, useRef, useState, useContext } from "react";
import ProductCard from "../components/ProductCard";
import { Link, useParams } from "react-router-dom";
import { SERVER_URL } from "../config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import parse from "html-react-parser";
import HelmetMetaData from "../components/HelmetMetaData";
import FacebookSharingButton from "../components/FacebookSharingButton";
import TwitterSharingButton from "../components/TwitterSharingButton";
import LinkedinSharingButton from "../components/LinkedinSharingButton";
import WhatsappSharingButton from "../components/WhatsappSharingButton";
import $ from "jquery";
import { saveAs } from "file-saver";
import FileDownload from "js-file-download";
import Axios from "axios";
import { CustomerContext } from "../Routes";
import ReactImageMagnify from "react-image-magnify";
import ReactImageZoom from "react-image-zoom";

// Create the function
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = false;
  document.body.appendChild(script);
}

const ProductDetails = () => {
  const { state, dispatch } = useContext(CustomerContext);

  const { slug } = useParams();
  const [productLoading, setProductLoading] = useState(true);
  const [addWishlistLoading, setAddWishlistLoading] = useState(false);
  const [removeWishlistLoading, setRemoveWishlistLoading] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [removeFromWishlist, setRemoveFromWishlist] = useState(false);
  const [submitEnquiryLoading, setSubmitEnquiryLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState({});
  const [product, setProduct] = useState({
    images: [],
    newArrivals: [],
    colors: [],
  });
  const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
  const [allWishlists, setAllWishlists] = useState([]);
  const ref = useRef();
  const [formData, setFormData] = useState({
    name: undefined,
    mobile: undefined,
    city: undefined,
    email: undefined,
    message: undefined,
    product_slug: slug,
  });

  const [previewImage, setPreviewImage] = useState("");

  // Enquiry Submit Handler
  const submitHandler = (evt) => {
    setSubmitEnquiryLoading(true);
    evt.preventDefault();

    fetch(SERVER_URL + "/enquiries", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            toast.success(result.message);
            $("#closeEnquiryButton").click();
            setFormData({
              name: "",
              email: "",
              message: "",
              mobile: "",
              city: "",
            });
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              toast.error(result.errors[key]);
            });
            toast.error(result.message);
          }
          setSubmitEnquiryLoading(false);
        },
        (error) => {
          setSubmitEnquiryLoading(false);
          toast.error(error);
        }
      );
  };

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" });
    AddLibrary(
      "https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"
    );
    AddLibrary(
      "https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"
    );
  }, [product]);

  // Get Products
  useEffect(() => {
    setProductLoading(true);
    fetch(`${SERVER_URL}/products/getBySlug/${slug}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setProduct(data.body || {});
          setPreviewImage(data.body.default_image);
        } else {
          toast.warning(data.message);
        }
        setProductLoading(false);
        // console.log("Product:", data);
      })
      .catch((error) => {
        setProductLoading(false);
        toast.warning(error);
      });
  }, [slug]);

  const downloadCatalogue = (evt, fileUrl) => {
    evt.preventDefault();
    fetch(product.catalogue, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `FileName.pdf`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  // Add Product to Wishlist
  const addWidhlistHandler = (evt) => {
    evt.preventDefault();
    setAddWishlistLoading(true);
    fetch(`${SERVER_URL}/wishlists`, {
      method: "POST", // or 'PUT'
      body: JSON.stringify({ product_id: product.id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAddWishlistLoading(false);
        if (data.status == 200) {
          toast.success(data.message);
          setAddedToWishlist(!addedToWishlist);
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setAddWishlistLoading(false);
        toast.error(error);
      });
  };

  // Remove Product to Wishlist
  const removeWidhlistHandler = (evt) => {
    evt.preventDefault();
    setRemoveWishlistLoading(true);
    fetch(`${SERVER_URL}/wishlists/${product.id}`, {
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
          setRemoveFromWishlist(!removeFromWishlist);
        } else {
          toast.warning(data.message);
        }
      })
      .catch((error) => {
        setRemoveWishlistLoading(false);
        toast.error(error);
      });
  };

  // Get Wishlist
  useEffect(() => {
    if (customerInfo) {
      setProductLoading(true);
      fetch(`${SERVER_URL}/wishlists/myWishlists`, {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${customerInfo ? customerInfo.jwtToken : ""}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProductLoading(false);
          if (data.status == 200) {
            setAllWishlists(data.body || []);
          } else {
            toast.warning(data.message);
          }
          // console.log("Wishlists:", data);
        })
        .catch((error) => {
          setProductLoading(false);
          toast.warning(error);
        });
    }
  }, [addedToWishlist, removeFromWishlist]);

  // Get Contact Us details
  useEffect(() => {
    fetch(`${SERVER_URL}/contactUs/`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setContactDetails(data.body || []);
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        toast.warning(error);
      });
  }, []);

  return (
    <>
      {!productLoading ? (
        <HelmetMetaData
          quotes=""
          title={product.name}
          image={product.default_image}
          description={product.name}
          hhashtag="#awni"
        />
      ) : (
        ""
      )}
      {/* breadcrumb-area start */}
      <div className="breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="breadcrumb-title">Product Details</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <a href="index.html">Home</a>
                </li>
                <li ref={ref} className="breadcrumb-item active">
                  Product Details
                </li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}
      {/* main-content-wrap start */}
      <div className="main-content-wrap section-ptb product-details-page">
        <div className="container">
          {!productLoading ? (
            <>
              {product.name ? (
                <div className="row">
                  {/* Product images */}
                  <div className="col-xl-6 col-lg-7 col-md-6">
                    <div className="product-details-images">
                      <div className="product_details_container">
                        {/* product_big_images start */}
                        <div className="product_big_images-right">
                          <div className="portfolio-full-image tab-content">
                            <div
                              role="tabpanel"
                              className="tab-pane active product-image-position"
                              id="img-tab-5"
                            >
                              {previewImage ? (
                                <ReactImageZoom
                                  {...{
                                    zoomWidth: 500,
                                    img: previewImage,
                                  }}
                                />
                              ) : (
                                ""
                              )}
                              {/* <ReactImageMagnify
                            {...{
                              smallImage: {
                                alt: "Wristwatch by Ted Baker London",
                                isFluidWidth: true,
                                src: previewImage,
                              },
                              largeImage: {
                                src: previewImage,
                                width: 1126,
                                height: 1333,
                              },
                              enlargedImageContainerDimensions: {
                                width: "125%",
                                height: "100%",
                              },
                              isHintEnabled: true,
                            }}
                          /> */}
                              {/* <a
                            href={product.default_image || ""}
                            className="img-poppu"
                          >
                            <img src={product.default_image || ""} alt="#" />
                          </a> */}
                            </div>
                            {product.images.length
                              ? product.images.map((image, index) => {
                                  return (
                                    <div
                                      key={index}
                                      role="tabpanel"
                                      className="tab-pane product-image-position"
                                      id={`img-tab-${index + 6}`}
                                    >
                                      <a
                                        href={image.url || ""}
                                        className="img-poppu"
                                      >
                                        <img src={image.url || ""} alt="#" />
                                      </a>
                                    </div>
                                  );
                                })
                              : ""}
                          </div>
                        </div>
                        {/* product_big_images end */}

                        {/* Start Small images */}
                        <ul
                          className="product_small_images-left vartical-product-active nav"
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
                              onClick={() => {
                                setPreviewImage(product.default_image);
                              }}
                            >
                              <img
                                src={`${
                                  product.default_image ||
                                  "/assets/images/product-details/small-img/1.jpg"
                                }`}
                                alt="#"
                              />
                            </a>
                          </li>

                          {product.images.length
                            ? product.images.map((image, index) => {
                                return (
                                  <li
                                    key={index}
                                    // role="presentation"
                                    // className="pot-small-img active"
                                  >
                                    <a
                                      // href={`#img-tab-${index + 6}`}
                                      // role="tab"
                                      // data-bs-toggle="tab"
                                      onClick={() => {
                                        setPreviewImage(image.url);
                                      }}
                                    >
                                      <img
                                        src={`${
                                          image.url ||
                                          "/assets/images/product-details/small-img/1.jpg"
                                        }`}
                                        alt="#"
                                      />
                                    </a>
                                  </li>
                                );
                              })
                            : ""}
                        </ul>
                        {/* End Small images */}
                      </div>
                    </div>
                  </div>

                  {/* products details */}
                  <div className="col-xl-6 col-lg-5 col-md-6">
                    {/* product_details_info start */}
                    <div className="product_details_info">
                      <h2> {product.name || ""} </h2>
                      {/* pro_rating start */}
                      {/* <div className="pro_rating d-flex">
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
                  </div> */}
                      {/* pro_rating end */}
                      {/* pro_details start */}
                      <div className="pro_details">
                        <p></p>
                      </div>
                      {/* pro_details end */}
                      {/* pro_dtl_prize start */}
                      <ul className="pro_dtl_prize">
                        <li className="old_prize">
                          {" "}
                          <i className="fa fa-inr"></i> {product.mrp}{" "}
                        </li>
                        <li>
                          <i className="fa fa-inr"></i> {product.selling_price}{" "}
                        </li>
                      </ul>
                      {/* pro_dtl_prize end */}
                      {/* pro_dtl_color start*/}
                      <div className="pro_dtl_color">
                        <h2 className="title_2">Choose Colour</h2>
                        <ul className="pro_choose_color">
                          {product.colors.map((color, index) => {
                            return (
                              <li key={index} style={{ color: color.name }}>
                                <a href="#">
                                  <i className="ion-record"></i>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      {/* pro_dtl_color end*/}
                      {/* pro_dtl_size start */}
                      <div className="pro_dtl_size">
                        <p className="title_2">
                          <b>Range </b> <span> {product.range_name || ""}</span>
                        </p>
                        <p className="title_2">
                          <b>Code </b> <span> {product.code || ""}</span>
                        </p>
                        <p className="title_2">
                          <b>Size</b> <span> {product.size || ""} </span>
                        </p>
                        <p className="title_2">
                          <b>Weight</b> <span> {product.weight || ""} </span>
                        </p>
                        {/*      <ul className="pro_choose_size">
                                <li><a href="#"></a></li>
                            </ul> */}
                      </div>
                      {/* pro_dtl_size end */}
                      {/* product-quantity-action start */}
                      {/* <div className="product-quantity-action">
                    <div className="prodict-statas">
                      <span>Quantity :</span>
                    </div>
                    <div className="product-quantity">
                      <form action="#">
                        <div className="product-quantity">
                          <div className="cart-plus-minus">
                            <input value="1" type="number" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div> */}
                      {/* product-quantity-action end */}
                      {/* pro_dtl_btn start */}
                      <ul className="pro_dtl_btn">
                        <li>
                          <div className="first">
                            <button
                              type="button"
                              data-toggle="modal"
                              data-target="#enquiryModal"
                              className="click buy_now_btn"
                              // onclick="smoothScroll(document.getElementById('second'))"
                              style={{ background: "#e97730", color: "#fff" }}
                            >
                              enquire now
                            </button>
                          </div>
                        </li>

                        <li>
                          {product.catalogue != "null" && (
                            <a
                              onClick={downloadCatalogue}
                              target={"_blank"}
                              href={
                                product.catalogue == "null"
                                  ? "#"
                                  : product.catalogue
                              }
                              className="buy_now_btn"
                              disabled
                            >
                              <i
                                className="fa fa-file-pdf-o"
                                style={{ marginRight: "8px" }}
                              ></i>
                              Download Brochures
                            </a>
                          )}
                        </li>
                        <li>
                          <a
                            href={`https://api.whatsapp.com/send?phone=+91${contactDetails.whatsapp_no}&text=Hii, I am From your website. and product is : ${window.location.href}`}
                            className="buy_now_btn"
                            style={{
                              backgroundColor: "#25d366",
                              color: "#fff",
                            }}
                          >
                            {" "}
                            <i
                              className="fa fa-whatsapp"
                              style={{ marginRight: "8px", fontSize: "20px" }}
                            ></i>
                          </a>
                        </li>
                        <li>
                          {addWishlistLoading ? (
                            <div>
                              <span
                                className="spinner-grow spinner-grow-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              &nbsp;
                              <span> Loading...</span>
                            </div>
                          ) : allWishlists.some((item) => item.slug == slug) ? (
                            <a
                              title="Added to Wishlist"
                              style={{ color: "white", background: "red" }}
                              onClick={removeWidhlistHandler}
                            >
                              <i className="ion-heart"></i>
                            </a>
                          ) : state && state.jwtToken ? (
                            <a onClick={addWidhlistHandler}>
                              <i className="ion-heart"></i>
                            </a>
                          ) : (
                            <Link to={"/account/login"}>
                              <i className="ion-heart"></i>
                            </Link>
                          )}
                        </li>
                      </ul>

                      {/* pro_social_share start */}
                      <div className="pro_social_share">
                        <h2 className="title_2">Share :</h2>
                        <ul className="pro_social_link">
                          <li>
                            <FacebookSharingButton />
                            {/* <a href="#" className="fa fa-facebook"></a> */}
                          </li>
                          <li>
                            <TwitterSharingButton />
                            {/* <a href="#" className="fa fa-twitter"></a> */}
                          </li>

                          <li>
                            {/* <InstagramSharingButton /> */}
                            {/* <a href="#" className="fa fa-instagram"></a> */}
                          </li>
                          <li>
                            <LinkedinSharingButton />
                            {/* <a href="#" className="fa fa-instagram"></a> */}
                          </li>
                          <li>
                            <WhatsappSharingButton />
                            {/* <a href="#" className="fa fa-instagram"></a> */}
                          </li>
                        </ul>
                      </div>
                      {/* pro_social_share end */}
                    </div>
                    {/* product_details_info end */}
                  </div>
                </div>
              ) : (
                <div className="alert alert-danger">Product Not Found</div>
              )}
            </>
          ) : (
            <div className="col-md-12 text-center">
              <Spinner /> <Spinner /> <Spinner />
            </div>
          )}
          <div className="row">
            <div className="col-12">
              <div className="product-details-tab mt--60">
                <ul role="tablist" className="mb--50 nav">
                  <li className="active" role="presentation">
                    <a
                      data-bs-toggle="tab"
                      role="tab"
                      href="#description"
                      className="active"
                    >
                      Description
                    </a>
                  </li>
                  {/* <li role="presentation">
                                <a data-bs-toggle="tab" role="tab" href="#sheet">Data sheet</a>
                            </li> */}
                  {/* <li role="presentation">
                    <a data-bs-toggle="tab" role="tab" href="#reviews">
                      Reviews
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="product_details_tab_content tab-content">
                {/* Start Single Content */}
                <div
                  className="product_tab_content tab-pane active"
                  id="description"
                  role="tabpanel"
                >
                  <div className="product_description_wrap">
                    <div className="product_desc mb--30">
                      {parse(product.description || "") || ""}
                      {/* <h2 className="title_3">Details</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        noexercit ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim
                        id.
                      </p> */}
                    </div>
                    {/* <div className="pro_feature">
                      <h2 className="title_3">Features</h2>
                      <ul className="feature_list">
                        <li>
                          <a href="#">
                            <i className="ion-ios-play-outline"></i>Duis aute irure
                            dolor in reprehenderit in voluptate velit esse
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="ion-ios-play-outline"></i>Irure dolor in
                            reprehenderit in voluptate velit esse
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="ion-ios-play-outline"></i>Sed do eiusmod
                            tempor incididunt ut labore et{" "}
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="ion-ios-play-outline"></i>Nisi ut aliquip
                            ex ea commodo consequat.
                          </a>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                </div>
                {/* End Single Content */}
                {/* Start Single Content */}
                <div
                  className="product_tab_content tab-pane"
                  id="sheet"
                  role="tabpanel"
                >
                  <div className="pro_feature">
                    <h2 className="title_3">Data sheet</h2>
                    <ul className="feature_list">
                      <li>
                        <a href="#">
                          <i className="ion-ios-play-outline"></i>Duis aute
                          irure dolor in reprehenderit in voluptate velit esse
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-ios-play-outline"></i>Irure dolor in
                          reprehenderit in voluptate velit esse
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-ios-play-outline"></i>Irure dolor in
                          reprehenderit in voluptate velit esse
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-ios-play-outline"></i>Sed do eiusmod
                          tempor incididunt ut labore et{" "}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-ios-play-outline"></i>Sed do eiusmod
                          tempor incididunt ut labore et{" "}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-ios-play-outline"></i>Nisi ut
                          aliquip ex ea commodo consequat.
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ion-ios-play-outline"></i>Nisi ut
                          aliquip ex ea commodo consequat.
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* End Single Content */}
                {/* Start Single Content */}
                <div
                  className="product_tab_content tab-pane"
                  id="reviews"
                  role="tabpanel"
                >
                  <div className="review_address_inner">
                    {/* Start Single Review */}
                    <div className="pro_review">
                      <div className="review_thumb">
                        <img
                          alt="review images"
                          src="/assets/images/review/1.html"
                        />
                      </div>
                      <div className="review_details">
                        <div className="review_info">
                          <h4>
                            <a href="#">Gerald Barnes</a>
                          </h4>
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
                          <div className="rating_send">
                            <a href="#">
                              <i className="ion-reply"></i>
                            </a>
                          </div>
                        </div>
                        <div className="review_date">
                          <span>27 Jun, 2018 at 3:30pm</span>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Integer accumsan egestas elese ifend. Phasellus
                          a felis at estei to bibendum feugiat ut eget eni
                          Praesent et messages in con sectetur posuere dolor
                          non.
                        </p>
                      </div>
                    </div>
                    {/* End Single Review */}
                    {/* Start Single Review */}
                    <div className="pro_review ans">
                      <div className="review_thumb">
                        <img
                          alt="review images"
                          src="/assets/images/review/2.html"
                        />
                      </div>
                      <div className="review_details">
                        <div className="review_info">
                          <h4>
                            <a href="#">Gerald Barnes</a>
                          </h4>
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
                          <div className="rating_send">
                            <a href="#">
                              <i className="ion-reply"></i>
                            </a>
                          </div>
                        </div>
                        <div className="review_date">
                          <span>27 Jun, 2018 at 4:32pm</span>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Integer accumsan egestas elese ifend. Phasellus
                          a felis at estei to bibendum feugiat ut eget eni
                          Praesent et messages in con sectetur posuere dolor
                          non.
                        </p>
                      </div>
                    </div>
                    {/* End Single Review */}
                  </div>
                  {/* Start RAting Area */}
                  <div className="rating_wrap">
                    <h2 className="rating-title">Write A review</h2>
                    <h4 className="rating-title-2">Your Rating</h4>
                    <div className="rating_list">
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
                    </div>
                  </div>
                  {/* End RAting Area */}
                  <div className="comments-area comments-reply-area">
                    <div className="row">
                      <div className="col-lg-12">
                        <form action="#" className="comment-form-area">
                          <div className="comment-input">
                            <p className="comment-form-author">
                              <label>
                                Name <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                required="required"
                                name="Name"
                              />
                            </p>
                            <p className="comment-form-email">
                              <label>
                                Email <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                required="required"
                                name="email"
                              />
                            </p>
                          </div>
                          <p className="comment-form-comment">
                            <label>Comment</label>
                            <textarea
                              className="comment-notes"
                              required="required"
                            ></textarea>
                          </p>
                          <div className="comment-form-submit">
                            <input
                              type="submit"
                              value="Post Comment"
                              className="comment-submit"
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Single Content */}

                {/* <div className="" id="second">Hi</div> */}

                <section className="RelatedPro">
                  <div className="section-title">
                    <h2>New Arrivals</h2>
                  </div>
                  <div className="shop-product-wrap">
                    <div className="row">
                      {product.newArrivals.length
                        ? product.newArrivals.map((newProduct) => {
                            return (
                              <ProductCard
                                name={newProduct.name}
                                slug={newProduct.slug}
                                mrp={newProduct.mrp}
                                selling_price={newProduct.selling_price}
                                // sellingPrice={newProduct.selling_price}
                                image={newProduct.default_image}
                              />
                            );
                          })
                        : ""}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="enquiryModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="enquiryModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ maxWidth: "500px" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title h6"
                id="enquiryModalLabel"
                style={{ fontWeight: 700 }}
              >
                QUICK ENQUIRY
              </h5>
              <button
                type="button"
                className="close btn btn-none"
                id="closeEnquiryButton"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={submitHandler}
                id="contact-form"
                action="https://template.hasthemes.com/fusta/fusta/mail.php"
                method="post"
              >
                <div className="form-group mb-2">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    onChange={(evt) => {
                      setFormData({ ...formData, name: evt.target.value });
                    }}
                    value={formData.name}
                    placeholder="Your Name*"
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    type="tel"
                    name="mobile"
                    className="form-control"
                    onChange={(evt) => {
                      setFormData({ ...formData, mobile: evt.target.value });
                    }}
                    value={formData.mobile}
                    placeholder="Mobile Number *"
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    type="tel"
                    name="city"
                    className="form-control"
                    onChange={(evt) => {
                      setFormData({ ...formData, city: evt.target.value });
                    }}
                    value={formData.city}
                    placeholder="Enter City"
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    onChange={(evt) => {
                      setFormData({ ...formData, email: evt.target.value });
                    }}
                    value={formData.email}
                    placeholder="Email Address"
                  />
                </div>
                <div className="form-group mb-2">
                  <textarea
                    name="message"
                    className="form-control"
                    value={formData.message}
                    onChange={(evt) => {
                      setFormData({
                        ...formData,
                        message: evt.target.value,
                      });
                    }}
                    placeholder="Your Message"
                  ></textarea>
                </div>

                <div className="contact-submit-btn">
                  <div className="button-box">
                    <button
                      className="register-btn btn"
                      type="submit"
                      disabled={submitEnquiryLoading ? true : false}
                    >
                      {submitEnquiryLoading ? (
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
                        <span>Submit Query</span>
                      )}
                    </button>
                  </div>
                  <p className="form-messege"></p>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button> */}
              {/* <button type="button" className="btn btn-primary">
                Save changes
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
