import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProductCard = ({ image, classes, name, mrp, selling_price, slug }) => {
  useEffect(() => {
    // window.scrollTo(0, 500);
  }, []);

  return (
    <div className={classes ? classes : "col-md-3"}>
      {/* single-product-wrap start */}
      <div className="single-product-wrap">
        <div className="product-image">
          <a href={`/product/${slug}`}>
            <img src={image || ""} alt="" />
          </a>
          {/* <div className="product-action">
                                    <a href="#" className="wishlist"><i className="icon-heart"></i></a>
                                    <a href="#" className="add-to-cart"><i className="icon-handbag"></i></a>
                                    <a href="#" className="quick-view" data-bs-toggle="modal" data-bs-target="#exampleModalCenter"><i className="icon-shuffle"></i></a>
                                </div> */}
        </div>
        <div className="product-content">
          <h3>
            <Link to={`/product/${slug}`}>
              {name.length > 19 ? name.slice(0, 20) + ".." : name}
            </Link>
          </h3>
          <div className="price-box">
            <span className="old-price">
              <i className="fa fa-inr"></i>
              {mrp}
            </span>
            <span
              className="new-price"
              style={{ display: "inline-block", marginLeft: "10px" }}
            >
              <i className="fa fa-inr"></i>
              {selling_price}
            </span>
          </div>
        </div>
        {/* <div className="product-content">
          <h3>
            <a href="#">Products Size</a>
            <a
              href="assets/images/AWNI_250x375mm_MIX.pdf"
              download
              className="text-danger"
              target="_blank"
            >
              <b>Download Our Catalogue</b>
            </a>
          </h3>
        </div> */}
      </div>
      {/* single-product-wrap end */}
    </div>
  );
};

export default ProductCard;
