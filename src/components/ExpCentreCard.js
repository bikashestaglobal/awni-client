import React from "react";
import parse from "html-react-parser";

const ExpCentreCard = ({ name, google_map, address, mobile_1, mobile_2 }) => {
  return (
    <div className="col-md-4 mt-4">
      <div className="contact-moreAdd">
        <h4>{name}</h4>
        <div>
          <iframe
            src={google_map}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <p className="mt-3">
          <div className="contact-us">{parse(address)}</div>
        </p>
        <p className="text-danger">
          <b>
            Contact: <a href={`tel:${mobile_1}`}>{mobile_1}</a>/
            <a href={`tel:${mobile_2}`}> {mobile_2} </a>
          </b>
        </p>
      </div>
    </div>
  );
};

export default ExpCentreCard;
