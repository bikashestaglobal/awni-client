import React from "react";

const test = () => {
  return (
    <body>
      {/* Main Wrapper Start */}
      <div className="main-wrapper">
        {/* breadcrumb-area start */}
        <div className="breadcrumb-area section-ptb">
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

        {/* main-content-wrap end */}
      </div>
    </body>
  );
};

export default test;
