import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SERVER_URL } from "../config";
import parse from "html-react-parser";
import Spinner from "../components/Spinner";
import ExpCentreCard from "../components/ExpCentreCard";

const Contact = () => {
  const [contactDetails, setContactDetails] = useState({});
  const [contactDetailsLoading, setContactDetailsLoading] = useState(true);

  const [expCentres, setExpCentres] = useState([]);
  const [expCentresLoading, setExpCentresLoading] = useState(true);

  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
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
            setFormData({ name: "", email: "", message: "", mobile: "" });
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              toast.error(result.errors[key]);
            });
            toast.error(result.message);
          }
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
          toast.error(error);
        }
      );
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.async = true;
    document.body.appendChild(script);
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

  // Get Experience Centes details
  useEffect(() => {
    setExpCentresLoading(true);
    fetch(`${SERVER_URL}/experienceCentres/`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setExpCentresLoading(false);
        if (data.status == 200) {
          setExpCentres(data.body || []);
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setExpCentresLoading(false);
        toast.warning(error);
      });
  }, []);

  // Scroll To Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
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
      {/* main-search start */}

      {/* breadcrumb-area start */}
      <div
        className="breadcrumb-area section-ptb"
        style={{
          background: `url('/assets/images/bg/between-product-banner.jpg') repeat scroll 0 0`,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="breadcrumb-title">Contact US</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <a href="index.html">Home</a>
                </li>
                <li className="breadcrumb-item active">Contact US</li>
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}

      {/* main-content-wrap start */}
      <div className="main-content-wrap section-ptb contact-us-page ">
        <div className="container">
          <div className="row">
            {/*  <div className="col-md-12 pb-5">
                    <div className="MapBox">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d58846.87128070549!2d70.83081341025554!3d22.805077726141846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSR.No.77P1%2CPlotNo.-1%2C%20SecondFloor%2C%20Shopno.-10%2C%20HarigunPlaza%2C%20AtMahendranagar%20Tal%26Dist-Morbi-363642%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1650389804348!5m2!1sen!2sin" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div> */}

            <div className="col-lg-6">
              <div className="contact-info-wrapper">
                <h2>Get in Touch</h2>
                {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum earum eveniet dolorum suscipit nesciunt incidunt animi repudiandae ab at, tenetur distinctio voluptate vel illo similique.</p> */}
                <ul className="contact-info-list">
                  <li>
                    <div className="icon rotate">
                      <i className="fa fa-map-marker" aria-hidden="true"></i>
                    </div>

                    <div className="text contact-us">
                      <span>AWNI Office</span>
                      <p className="">
                        {parse(contactDetails.address || "") || ""}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon rotate">
                      <i className="fa fa-phone" aria-hidden="true"></i>
                    </div>
                    <div className="text">
                      <span>Phone</span>
                      <p className="telephone">
                        {" "}
                        {/* <a href={`tel:${contactDetails.customer_care_no}`}>
                          Customer Care: {contactDetails.customer_care_no}
                        </a> */}
                        <a href={`tel:${contactDetails.mobile_1}`}>
                          Contact number : {contactDetails.mobile_1} /{" "}
                          {contactDetails.mobile_2}
                        </a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon rotate">
                      <i className="fa fa-headphones" aria-hidden="true"></i>
                    </div>
                    <div className="text">
                      <span>Customer Care</span>
                      <p className="telephone">
                        {" "}
                        <a href={`tel:${contactDetails.customer_care_no}`}>
                          Contact No : {contactDetails.customer_care_no}
                        </a>
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon rotate">
                      <i className="fa fa-envelope" aria-hidden="true"></i>
                    </div>
                    <div className="text">
                      <span>E-mail</span>
                      <p className="telephone">
                        <a href={`mailto:${contactDetails.email}`}>
                          {" "}
                          {contactDetails.email}
                        </a>
                      </p>
                    </div>
                  </li>

                  <li>
                    <div className="icon rotate">
                      <i className="fa fa-whatsapp" aria-hidden="true"></i>
                    </div>
                    <div className="text">
                      <span>WhatsApp</span>
                      <p className="telephone">
                        {" "}
                        <a
                          href={`https://wa.me/${contactDetails.whatsapp_no}?text="Hi, I want to know more about your products."`}
                        >
                          {contactDetails.whatsapp_no}
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-form-warp">
                <div className="title">
                  <h2>Enquire Now</h2>
                </div>
                <form onSubmit={submitHandler}>
                  <div className="row">
                    <div className="col-lg-10">
                      <input
                        type="text"
                        name="name"
                        onChange={(evt) => {
                          setFormData({ ...formData, name: evt.target.value });
                        }}
                        value={formData.name}
                        placeholder="Your Name*"
                      />
                    </div>
                    <div className="col-lg-10">
                      <input
                        type="text"
                        name="mobile"
                        onChange={(evt) => {
                          setFormData({
                            ...formData,
                            mobile: evt.target.value,
                          });
                        }}
                        value={formData.mobile}
                        placeholder="Mobile Number*"
                      />
                    </div>
                    <div className="col-lg-10">
                      <input
                        type="email"
                        name="email"
                        onChange={(evt) => {
                          setFormData({ ...formData, email: evt.target.value });
                        }}
                        value={formData.email}
                        placeholder="E-Mail Address*"
                      />
                    </div>
                    <div className="col-lg-10">
                      <textarea
                        name="message"
                        rows={8}
                        value={formData.message}
                        onChange={(evt) => {
                          setFormData({
                            ...formData,
                            message: evt.target.value,
                          });
                        }}
                        placeholder="Your Message*"
                      ></textarea>
                    </div>
                  </div>
                  <div className="contact-submit-btn">
                    <button type="submit" className="submit-btn">
                      Submit Query
                    </button>
                    <p className="form-messege"></p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="row pt-5">
            <div className="col-md-12">
              <h2 className="title">Experience Centre</h2>
            </div>

            {expCentresLoading ? (
              <Spinner />
            ) : expCentres.length ? (
              expCentres.map((centre, index) => {
                return (
                  <ExpCentreCard
                    name={centre.name || ""}
                    address={centre.address || ""}
                    google_map={centre.google_map || ""}
                    mobile_1={centre.mobile_1 || ""}
                    mobile_2={centre.mobile_2 || ""}
                  />
                );
              })
            ) : (
              "Not Available"
            )}
          </div>
        </div>
      </div>

      {/* main-content-wrap end */}
    </>
  );
};

export default Contact;
