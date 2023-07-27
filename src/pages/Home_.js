import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SERVER_URL } from "../config";
import Slider from "react-slick";
import Spinner from "../components/Spinner";
import BannerSkeletonLoader from "../components/BannerSkeletonLoader";
import SliderSkeletonLoader from "../components/SliderSkeletonLoader";
import CategorySkeletonLoader from "../components/CategorySkeletonLoader";

// Create the function
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = false;
  document.body.appendChild(script);
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slider-arrow slider-btn`}
      style={{
        ...style,
        // display: "none",
      }}
      id="carausel-4-columns-2-arrows"
      onClick={onClick}
    >
      <span className="slider-btn slider-prev slick-arrow">
        <i className="fa fa-angle-left"></i>
      </span>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slider-arrow slider-arrow-2 carausel-4-columns-arrow`}
      id="carausel-4-columns-2-arrows"
      style={{ ...style }}
      onClick={onClick}
    >
      <span className="slider-btn slider-next slick-arrow">
        <i className="fa fa-angle-right"></i>
      </span>
    </div>
  );
}

var settings3 = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  swipeToSlide: true,
  autoplay: true,
  autoplaySpeed: 5000,
  initialSlide: 0,
  prevArrow: <SampleNextArrow />,
  nextArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        dots: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
      },
    },
  ],
};

var settings2 = {
  dots: false,
  fade: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  autoplay: true,
  autoplaySpeed: 5000,
  initialSlide: 0,
  prevArrow: <SampleNextArrow />,
  nextArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        dots: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
      },
    },
  ],
};

const Home = () => {
  const [parCategories, setParentcategories] = useState([]);
  const [parCatLoading, setParCatLoading] = useState(false);

  const [imageSliders, setImageSliders] = useState([]);
  const [imageSliderLoading, setImageSliderLoading] = useState(true);

  const [catProducts, setCatProducts] = useState([]);
  const [moreCatProducts, setMoreCatProducts] = useState([]);
  const [catProductsLoading, setCatProductsLoading] = useState(false);

  const [bannerAfterSlider, setBannerAfterSlider] = useState([]);
  const [bannerLoading, setBannerLoading] = useState([]);
  const [bannerBetweenProduct, setBannerBetweenPost] = useState({});

  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [youtubeVideoLoading, setYoutubeVideoLoading] = useState(false);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // Get All Parent Categoies
  useEffect(() => {
    setParCatLoading(true);
    fetch(`${SERVER_URL}/parentCategories`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setParCatLoading(false);
        if (data.status == 200) {
          setParentcategories(data.body || []);
        } else {
          // toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setParCatLoading(false);
        // toast.warning(error);
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
          setParentcategories(data.body || []);
        } else {
          toast.warning(data.message);
        }
        // console.log("All Child Category:", data);
      })
      .catch((error) => {
        toast.error(error);
      });
  }, []);

  // Get Category Products
  useEffect(() => {
    setCatProductsLoading(true);
    fetch(`${SERVER_URL}/parentCategories/allProducts`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCatProductsLoading(false);
        if (data.status == 200) {
          if (data.body) {
            setCatProducts(data.body.slice(0, 3) || []);
            if (data.body.length > 2) {
              setMoreCatProducts(data.body.slice(3));
            }
          }
        } else {
          // toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setCatProductsLoading(false);
        // toast.warning(error);
      });
  }, []);

  // Get Image Sliders
  useEffect(() => {
    const localSlider = JSON.parse(localStorage.getItem("slider"));
    if (localSlider) {
      setImageSliders(localSlider);
      setImageSliderLoading(false);
    } else {
      fetch(`${SERVER_URL}/sliders`, {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setImageSliderLoading(false);

          if (data.status == 200) {
            setImageSliders(data.body || []);
            // Set slider to localStorege
            localStorage.setItem("slider", JSON.stringify(data.body));
          } else {
            toast.warning(data.message);
          }
        })
        .catch((error) => {
          setImageSliderLoading(false);
          // toast.warning(error);
        });
    }
  }, []);

  // Get Banners
  useEffect(() => {
    setBannerLoading(true);
    fetch(`${SERVER_URL}/homepageBanners`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBannerLoading(false);
        if (data.status == 200) {
          if (data.body.length) {
            let afterSlider = data.body.filter(
              (value) => value.place == "AFTER_SLIDER"
            );

            let betweenProduct = data.body.filter(
              (value) => value.place == "BETWEEN_PRODUCT"
            );
            if (betweenProduct.length) {
              setBannerBetweenPost(betweenProduct[0] || {});
            }

            setBannerAfterSlider(afterSlider.slice(0, 3) || []);
          }
        } else {
          // toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setBannerLoading(false);
        // toast.warning(error);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // get Records
  useEffect(() => {
    setYoutubeVideoLoading(true);
    fetch(`${SERVER_URL}/aboutUs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setYoutubeVideoLoading(false);
          if (result.status === 200) {
            if (result.body) {
              setYoutubeVideoId(result.body.youtube_video || "");
            } else {
              setYoutubeVideoId(result.body.youtube_video || "");
            }
          } else {
            toast.warning(result.message);
          }
        },
        (error) => {
          setYoutubeVideoLoading(false);
          // M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  return (
    // {/*Main Wrapper Start */}
    <>
      {/*Hero Slider Start */}
      <div className="hero-slider hero-slider-one slick-initialized slick-slider">
        {imageSliderLoading ? (
          <div className="col-md-12 text-center d-flex align-items-center">
            <SliderSkeletonLoader />
          </div>
        ) : imageSliders.length ? (
          <div className="">
            <Slider {...settings2}>
              {imageSliders.map((sliderImage, index) => {
                return (
                  <div key={index} className="col-md-12">
                    <img src={sliderImage.image} alt="" />
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          <div className="">
            <span></span>
          </div>
        )}
      </div>

      {/*Hero Section End */}

      {/*banner-area start */}
      <div className="banner-area mt-3">
        <div className="container-fluid">
          <div className="row">
            {bannerLoading ? (
              <div className="col-md-12 text-center row">
                {[...Array(3)].map((_, __) => {
                  return (
                    <div className="col-lg-4 col-md-6" key={`sk-${__}`}>
                      <BannerSkeletonLoader />;
                    </div>
                  );
                })}
              </div>
            ) : bannerAfterSlider.length ? (
              bannerAfterSlider.map((banner, index) => {
                return (
                  <div className="col-lg-4 col-md-6" key={index}>
                    {/* single-banner start */}
                    <div className="single-banner">
                      <div className="banner-bg">
                        <Link to={`${banner.webpage_url}`}>
                          <img src={banner.image || ""} alt="" />
                        </Link>
                      </div>
                      <div className="banner-contet">
                        {/*  <p>30% Off</p> */}
                        <h3> {banner.title} </h3>
                        {/* <Link href="#" className="btn-3">SHOP NOW</Link> */}
                      </div>
                    </div>
                    {/* single-banner end */}
                  </div>
                );
              })
            ) : (
              <div className="alert alert-danger m-auto">
                <span>Banner not Available</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*banner-area end */}

      {/*Our Product Category */}
      <div
        className="our-brand-area section-ptb"
        style={{ background: "#f9f9f9" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/*section-title start */}
              <div className="section-title mb-5">
                <h2>Our Product Categories</h2>
              </div>
              {/*section-title end */}
            </div>
            <div className="col">
              <div className="cat-slider">
                <Slider {...settings3}>
                  {parCatLoading
                    ? [...Array(5)].map(() => (
                        <div className="single-brand p-1">
                          <CategorySkeletonLoader />
                        </div>
                      ))
                    : parCategories.map((parCategory, index) => {
                        return (
                          <CategoryCard
                            key={index}
                            slug={parCategory.slug}
                            name={parCategory.name}
                            image={parCategory.image}
                          />
                        );
                      })}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*our-brand-area end */}

      {/*product-area start */}
      {catProducts.map((catProduct, index) => {
        return (
          <div
            className="product-area section-ptb"
            key={index}
            style={{ background: index % 2 == 0 ? "#fff" : "#f9f9f9" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  {/* section-title start */}
                  <div className="section-title">
                    <h2>{catProduct.name} </h2>
                  </div>
                  {/* section-title end */}
                </div>
              </div>

              {/* product-warpper start */}
              <div className="product-warpper">
                <div className="row">
                  {catProduct.products.map((product, index) => {
                    return (
                      <ProductCard
                        mrp={product.mrp}
                        selling_price={product.selling_price}
                        name={product.name}
                        slug={product.slug}
                        image={product.default_image}
                        key={index}
                      />
                    );
                  })}

                  {/* <div className="about-contents text-center mt-5">
                    <a
                      href="assets/images/Awni sanitry 2020.pdf"
                      target="_blank"
                      download
                      className="btn shop-btn-two"
                    >
                      Download Our Catalogue
                    </a>
                  </div> */}
                </div>
              </div>
              {/* product-warpper start */}
            </div>
          </div>
        );
      })}
      {/*product-area end */}

      {/*add product section */}

      {/*lg-banner-bg start */}
      <div
        className="lg-banner-area lg-banner-bg section-ptb"
        style={{
          background: `url(${
            bannerBetweenProduct.image || "/assets/images/bg/01.jpg"
          })`,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-10">
              <div className="lg-banner-info">
                <h2>
                  {bannerBetweenProduct.title ||
                    "Contrary to popular belief is not simply rand."}
                </h2>

                <Link
                  to={bannerBetweenProduct.webpage_url}
                  className="btn more-product-btn"
                >
                  READ MORE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*lg-banner-bg end */}

      {/*product-area start */}
      {moreCatProducts.map((catProduct, index) => {
        return (
          <div
            className="product-area section-ptb"
            key={index}
            style={{ background: index % 2 == 0 ? "#fff" : "#f9f9f9" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  {/* section-title start */}
                  <div className="section-title">
                    <h2>{catProduct.name} </h2>
                  </div>
                  {/* section-title end */}
                </div>
              </div>

              {/* product-warpper start */}
              <div className="product-warpper">
                <div className="row">
                  {catProduct.products.map((product, index) => {
                    return (
                      <ProductCard
                        mrp={product.mrp}
                        selling_price={product.selling_price}
                        name={product.name}
                        image={product.default_image}
                        key={index}
                      />
                    );
                  })}

                  <div className="about-contents text-center mt-5">
                    <a
                      href="assets/images/Awni sanitry 2020.pdf"
                      target="_blank"
                      download
                      className="btn shop-btn-two"
                    >
                      Download Our Catalogue
                    </a>
                  </div>
                </div>
              </div>
              {/* product-warpper start */}
            </div>
          </div>
        );
      })}
      {/*product-area end */}

      <section
        className="VSec"
        style={{
          backgroundImage: "url(assets/images/video-v1-bg.jpg)",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-9 m-auto">
              <div className="video-one__inner text-center">
                {youtubeVideoLoading ? (
                  <BannerSkeletonLoader />
                ) : (
                  <iframe
                    width="100%"
                    height="450px"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*footer-area start */}

      {/*footer-area end */}

      {/*Modal-wrapper end */}
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

export default Home;
