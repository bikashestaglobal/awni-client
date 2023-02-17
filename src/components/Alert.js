import React, { useState } from "react";

const Alert = ({ className, text }) => {
  const [hide, setHide] = useState(false);
  return (
    <div
      className={`alert alert-dismissible fade ${
        hide ? "hide" : "show"
      } ${className} d-flex justify-content-between`}
      role="alert"
    >
      <spa>{text}</spa>
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={(evt) => setHide(true)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default Alert;
