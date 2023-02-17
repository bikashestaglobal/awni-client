import React from "react";

const Spinner = () => {
  return (
    // <div className="d-flex justify-content-center">
    //   <div className="spinner-grow" role="status">
    //     <span className="sr-only">Loading...</span>
    //   </div>
    // </div>
    <div
      className="spinner-grow spinner-grow-sm m-auto text-center"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
