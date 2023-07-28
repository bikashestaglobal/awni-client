import React, { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import { toast } from "react-toastify";
import { SERVER_URL } from "../config";
import parse from "html-react-parser";
import Spinner from "../components/Spinner";
import Slider from "react-slick/lib/slider";
import WhyAwniCard from "../components/WhyAwniCard";
// Create the function
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = false;
  document.body.appendChild(script);
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
  // prevArrow: <SampleNextArrow />,
  // nextArrow: <SamplePrevArrow />,
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

const About = () => {
  const [aboutDetailsLoading, setAboutDetailsLoading] = useState(true);
  const [aboutDetails, setAboutDetails] = useState([]);

  const [whyPointsLoading, setWhyPointsLoading] = useState(true);
  const [whyPoints, setWhyPoints] = useState([]);

  const [parCategories, setParentcategories] = useState([]);
  const [parCatLoading, setParCatLoading] = useState(true);

  // Get About Us details
  useEffect(() => {
    setAboutDetailsLoading(true);
    fetch(`${SERVER_URL}/aboutUs/`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAboutDetailsLoading(false);
        if (data.status == 200) {
          setAboutDetails(data.body || []);
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setAboutDetailsLoading(false);
        toast.warning(error);
      });
  }, []);

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
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setParCatLoading(false);
        toast.warning(error);
      });
  }, []);

  // Get Why Awni Points details
  useEffect(() => {
    setWhyPointsLoading(true);
    fetch(`${SERVER_URL}/whyAwni/`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWhyPointsLoading(false);
        if (data.status == 200) {
          setWhyPoints(data.body || []);
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setWhyPointsLoading(false);
        toast.warning(error);
      });
  }, []);

  // Scroll To Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {/* breadcrumb-area start */}
      <div className="breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="breadcrumb-title">About Us</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <a href="index.html">Home</a>
                </li>
                <li className="breadcrumb-item active">About Us</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}

      {/* main-content-wrap start */}
      <div className="main-content-wrap about-us-page">
        {/* about-area start */}
        <div className="about-area section-pt section-pb">
          <div className="container">
            <div className="row">
              <div className="col-xl-6">
                <div className="about-one__img about-area">
                  <div className="about-one__img1 d-none d-lg-block">
                    <img
                      src={
                        aboutDetails.about_bg_image != "null"
                          ? aboutDetails.about_bg_image
                          : "/assets/images/about-v1-img1.jpg"
                      }
                      alt="About Image 1"
                    />
                  </div>

                  <div className="about-one__img2">
                    <img
                      src={
                        aboutDetails.about_fe_image != "null"
                          ? aboutDetails.about_fe_image
                          : "/assets/images/about-v1-img1.jpg"
                      }
                      alt="About Image 2"
                    />
                  </div>
                  <span className="text_left">
                    {aboutDetails.about_image_title}
                  </span>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="about-contents">
                  <h2 className="sec-title__title">
                    {aboutDetailsLoading ? (
                      <Spinner />
                    ) : (
                      aboutDetails.about_title || ""
                    )}
                  </h2>

                  <div className="contact-us">
                    {aboutDetailsLoading ? (
                      <Spinner />
                    ) : (
                      parse(aboutDetails.about_description || "") || ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* about-area end */}

        <section className="mission-one">
          <div className="container">
            <div className="row">
              {/*Start Mission One Content*/}
              <div className="col-xl-6">
                <div className="mission-one__content">
                  <div className="mission-one__content-single">
                    <h2>
                      {aboutDetailsLoading ? (
                        <Spinner />
                      ) : (
                        aboutDetails.mission_title || "Our Mission"
                      )}
                    </h2>
                    <div className="text1 contact-us">
                      {aboutDetailsLoading ? (
                        <Spinner />
                      ) : (
                        parse(aboutDetails.mission_description || "") || ""
                      )}
                    </div>
                  </div>

                  <div className="mission-one__content-single marb-0">
                    <h2>
                      {aboutDetailsLoading ? (
                        <Spinner />
                      ) : (
                        aboutDetails.vision_title || "Our Vision"
                      )}
                    </h2>
                    <div className="text1 contact-us">
                      {aboutDetailsLoading ? (
                        <Spinner />
                      ) : (
                        parse(aboutDetails.vision_description || "") || ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/*End Mission One Content*/}

              {/*Start Mission One Img*/}
              <div className="col-xl-6">
                <div className="mission-one__img">
                  <div className="mission-one__img-img1">
                    <img
                      src={
                        aboutDetails.mission_bg_image != "null"
                          ? aboutDetails.mission_bg_image
                          : "/assets/images/mission-v1-img1.jpg"
                      }
                      alt=""
                    />
                  </div>

                  <div className="mission-one__img-img2 wow slideInRight animated d-none d-lg-block">
                    <img
                      src={
                        aboutDetails.mission_fe_image != "null"
                          ? aboutDetails.mission_fe_image
                          : "/assets/images/mission-v1-img2.jpg"
                      }
                      alt=""
                    />
                  </div>
                </div>
              </div>
              {/*End Mission One Img*/}
            </div>
          </div>
        </section>

        {/* secton-area start */}

        <section className="best-logistics-one">
          <div className="shape2 zoominout">
            <img
              src="/assets/images/shapes/best-logistics-v1-shape2.png"
              alt=""
            />
          </div>
          <div className="container">
            <div className="row">
              {/*Start Best Logistics One Content*/}
              <div className="col-xl-6">
                <div className="best-logistics-one__content">
                  <div className="sec-title">
                    <h2 className="sec-title__title">
                      {aboutDetailsLoading ? (
                        <Spinner />
                      ) : (
                        aboutDetails.why_title || "WHY AWNI"
                      )}
                    </h2>
                  </div>
                  <div className="">
                    {aboutDetailsLoading ? (
                      <Spinner />
                    ) : (
                      parse(aboutDetails.why_description || "") ||
                      "WHY DESCRIPTION"
                    )}
                  </div>
                </div>
              </div>
              {/*End Best Logistics One Content*/}

              {/*Start Best Logistics One Img*/}
              <div className="col-xl-6">
                <div className="best-logistics-one__img">
                  <div className="shape1 zoom-fade">
                    <img
                      src="/assets/images/best-logistics-v1-shape1.png"
                      alt=""
                    />
                  </div>

                  <div className="best-logistics-one__img-inner">
                    <ul className="Incon">
                      {whyPointsLoading ? (
                        <Spinner />
                      ) : whyPoints.length ? (
                        whyPoints.map((whyPoint, index) => {
                          return (
                            <li>
                              <div className="media">
                                <div className="IconArea">
                                  <img
                                    className="align-self-start mr-3"
                                    src={whyPoint.image}
                                    alt={whyPoint.title}
                                  />
                                </div>
                                <div className="media-body">
                                  <h3 className="mt-0">
                                    <b> {whyPoint.title} </b>
                                  </h3>
                                </div>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        "Not Available"
                      )}
                      {/* 
                      <li>
                        <div className="media">
                          <div className="IconArea">
                            <img
                              className="align-self-start mr-3"
                              src="/assets/images/Marble Counter top basin.png"
                              alt=""
                            />
                          </div>
                          <div className="media-body">
                            <h3 className="mt-0">
                              <b>Marble Counter top basin</b>
                            </h3>
                          </div>
                        </div>
                      </li>

                      <li>
                        <div className="media">
                          <div className="IconArea">
                            <img
                              className="align-self-start mr-3"
                              src="/assets/images/Metarial & Tool.png"
                              alt=""
                            />
                          </div>
                          <div className="media-body">
                            <h3 className="mt-0">
                              <b>Metarial & Tool</b>
                            </h3>
                          </div>
                        </div>
                      </li>

                      <li>
                        <div className="media">
                          <div className="IconArea">
                            <img
                              className="align-self-start mr-3"
                              src="/assets/images/Wall Hung.png"
                              alt=""
                            />
                          </div>
                          <div className="media-body">
                            <h3 className="mt-0">
                              <b>Wall Hung</b>
                            </h3>
                          </div>
                        </div>
                      </li>

                      <li>
                        <div className="media">
                          <div className="IconArea">
                            <img
                              className="align-self-start mr-3"
                              src="/assets/images/Wood Countrer top.png"
                              alt=""
                            />
                          </div>
                          <div className="media-body">
                            <h3 className="mt-0">
                              <b>Wood Countrer top</b>
                            </h3>
                          </div>
                        </div>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              {/*End Best Logistics One Img*/}
            </div>
          </div>
        </section>

        {/* our-brand-area start */}
        <div className="our-brand-area section-ptb">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {/*section-title start */}
                <div className="section-title mb-5">
                  <h2>WHY AWNI</h2>
                  {/* <h2>Our Product Categories</h2> */}
                </div>
                {/*section-title end */}
              </div>

              {/* <div className="col">
                <div className="cat-slider">
                  <Slider {...settings3}>
                    {parCatLoading ? (
                      <Spinner />
                    ) : (
                      parCategories.map((parCategory, index) => {
                        return (
                          <CategoryCard
                            key={index}
                            slug={parCategory.slug}
                            name={parCategory.name}
                            image={parCategory.image}
                          />
                        );
                      })
                    )}
                  </Slider>
                </div>
              </div> */}

              <div className="col">
                <div className="cat-slider">
                  <Slider {...settings3}>
                    {whyPointsLoading ? (
                      <Spinner />
                    ) : (
                      whyPoints.map((whyPoint, index) => {
                        return (
                          <WhyAwniCard
                            key={index}
                            slug={whyPoint.slug}
                            name={whyPoint.title}
                            image={whyPoint.image}
                          />
                        );
                      })
                    )}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* our-brand-area end */}
      </div>
      {/* main-content-wrap end */}
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

export default About;
