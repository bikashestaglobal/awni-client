import React from "react";
import { Link } from "react-router-dom";
const CategoryCard = ({ image, name, slug }) => {
  return (
    <div className="single-brand">
      <div className="Bproducts">
        <Link to={`/${slug || ""}`} className={"d-block"}>
          <div className="media">
            <img className="mr-3" src={image || ""} alt="" />
            <div className="media-body">
              <h4 className="mt-0">{name || ""}</h4>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
