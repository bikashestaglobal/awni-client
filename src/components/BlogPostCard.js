import React from "react";

const BlogPostCard = ({ image }) => {
  return (
    <div className="col-md-4">
      <div className="blog-wrapper mt-3">
        <div className="blog-wrap">
          {/*single-blog-area start */}
          <div className="single-blog-area">
            <div className="blog-image">
              <a href="blog-details.html">
                <img src={image} alt="" />
              </a>
            </div>
            <div className="blog-contend">
              <h3>
                <a href="#">Blog image post</a>
              </h3>
              <div className="blog-date-categori">
                <ul>
                  <li>
                    <a href="#">
                      <i className="ion-ios-person"></i> Admin{" "}
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="ion-ios-pricetags"></i> Comments{" "}
                    </a>
                  </li>
                </ul>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adip elit...</p>
              <div className="mt-30 blog-more-area">
                <a href="blog-details.html" className="blog-btn btn">
                  Read more
                </a>
              </div>
            </div>
          </div>
          {/*single-blog-area end */}
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
