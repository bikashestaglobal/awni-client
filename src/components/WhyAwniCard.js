import React from "react";
import { Link } from "react-router-dom";
const WhyAwniCard = ({ image, name, slug }) => {
  return (
    <div className="single-brand">
      <div className="Bproducts">
        <Link to={`/${slug || ""}`} className={"d-block"}>
          <div className="media">
            <img
              className="mr-3"
              style={{ height: "64px", width: "64px" }}
              src={image || ""}
              alt=""
            />
            <div className="media-body">
              <h4 style={{ lineHeight: "14px" }} className="mt-0">
                {name || ""}
              </h4>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WhyAwniCard;
