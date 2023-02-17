import React, { useEffect, useRef, useState, useContext } from "react";
import ProductCard from "../components/ProductCard";
import { useParams, Link } from "react-router-dom";
import { SERVER_URL } from "../config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import parse from "html-react-parser";
import "jquery/dist/jquery.js";
import $ from "jquery";
import { CustomerContext } from "../Routes";
import "ion-rangeslider/css/ion.rangeSlider.min.css";
import "ion-rangeslider/js/ion.rangeSlider.min.js";

const Listing = () => {
  const { state, dispatch } = useContext(CustomerContext);
  const { parCatSlug, subCatSlug, childCatSlug } = useParams();
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState({
    min: 0,
    max: 50000,
  });
  const [sort, setSort] = useState("default");
  const [useRangeFilter, setUseRangeFilter] = useState(true);
  const myRef = useRef(null);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 9,
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
  });
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [childCategories, setChildCategories] = useState([]);

  const [categories, setCategories] = useState([]);

  const [rangeLoading, setRangeLoading] = useState(true);
  const [allRanges, setAllRanges] = useState([]);

  const [filterRange, setFilterRange] = useState(undefined);
  const [activeRange, setActiveRange] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    // ref.current.scrollIntoView({ behavior: "smooth" });
  }, [parCatSlug]);

  // Get Products
  useEffect(() => {
    setProductsLoading(true);
    fetch(
      `${SERVER_URL}/products?parCatSlug=${parCatSlug}&subCatSlug=${subCatSlug}&childCatSlug=${childCatSlug}&limit=${pagination.limit}&skip=${pagination.skip}&max=${range.max}&min=${range.min}&range_id=${filterRange}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setProductsLoading(false);
        if (data.status == 200) {
          let unsortedProducts = [...data.body];
          if (sort == "default") {
          } else if (sort == "name-a-z") {
            unsortedProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
          } else if (sort == "name-z-a") {
            unsortedProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
          } else if (sort == "price-l-h") {
            unsortedProducts.sort((a, b) =>
              a.selling_price > b.selling_price ? 1 : -1
            );
          } else if (sort == "price-h-l") {
            unsortedProducts.sort((a, b) =>
              a.selling_price < b.selling_price ? 1 : -1
            );
          }
          setProducts(unsortedProducts);
          // setProducts(data.body || {});
          // sortData();
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        setProductsLoading(false);
        toast.warning(error);
      });
  }, [
    parCatSlug,
    subCatSlug,
    childCatSlug,
    useRangeFilter,
    pagination,
    filterRange,
  ]);

  // Total Products
  useEffect(() => {
    fetch(
      `${SERVER_URL}/products?parCatSlug=${parCatSlug}&subCatSlug=${subCatSlug}&childCatSlug=${childCatSlug}&limit=100000&skip=0&max=${range.max}&min=${range.min}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setPagination({
            ...pagination,
            totalRecord: data.body.length,

            totalPage: Math.ceil(data.body.length / pagination.limit),
          });
        } else {
          toast.warning(data.message);
        }
        // console.log("Success:", data);
      })
      .catch((error) => {
        toast.warning(error);
      });
  }, [parCatSlug, subCatSlug, useRangeFilter, childCatSlug]);

  useEffect(() => {
    try {
      $(".js-range-slider").ionRangeSlider({
        type: "double",
        min: 0,
        max: 50000,
        from: 0,
        to: 50000,
        drag_interval: true,
        min_interval: null,
        max_interval: null,
        onChange: (data) => {
          setRange({ ...range, min: data.from, max: data.to });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    let unsortedProducts = [...products];
    if (sort == "default") {
    } else if (sort == "name-a-z") {
      unsortedProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (sort == "name-z-a") {
      unsortedProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
    } else if (sort == "price-l-h") {
      unsortedProducts.sort((a, b) =>
        a.selling_price > b.selling_price ? 1 : -1
      );
    } else if (sort == "price-h-l") {
      unsortedProducts.sort((a, b) =>
        a.selling_price < b.selling_price ? 1 : -1
      );
    }
    setProducts(unsortedProducts);
  }, [sort]);

  // Get Ranges
  useEffect(() => {
    setRangeLoading(true);
    fetch(`${SERVER_URL}/ranges`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRangeLoading(false);
        if (data.status == 200) {
          setAllRanges(data.body);
        } else {
          toast.warning(data.message);
        }
      })
      .catch((error) => {
        setRangeLoading(false);
        toast.warning(error);
      });
  }, []);

  // Get Child Category
  useEffect(() => {
    if (subCatSlug) {
      setCategoriesLoading(true);
      fetch(
        `${SERVER_URL}/childCategories?cat_slug='${subCatSlug}'&limit=20000`,
        {
          method: "GET", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setCategoriesLoading(false);
          if (data.status == 200) {
            if (data.body) {
              setChildCategories(data.body);

              // Set Categories to Empty Array
              setCategories([]);
            }
          } else {
            toast.warning(data.message);
          }
          // console.log("Category:", data);
        })
        .catch((error) => {
          setCategoriesLoading(false);
          toast.warning(error);
        });
    }
  }, [subCatSlug]);

  // Get Category
  useEffect(() => {
    if (parCatSlug && !subCatSlug) {
      setCategoriesLoading(true);
      fetch(`${SERVER_URL}/categories?par_cat_slug='${parCatSlug}'&limit=20`, {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 200) {
            if (data.body) {
              setCategories(data.body);

              // Set Child Categories to Empty Array
              setChildCategories([]);
            }
          } else {
            toast.warning(data.message);
          }
          setCategoriesLoading(false);
        })
        .catch((error) => {
          setCategoriesLoading(false);
          toast.warning(error);
        });
    }
  }, [parCatSlug, subCatSlug]);

  const rangeFilterHandler = (evt) => {
    evt.preventDefault();
    setUseRangeFilter(!useRangeFilter);
  };

  const pageHandler = (e, page) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      skip: page == 1 ? 0 : (page - 1) * pagination.limit,
      currentPage: page,
    });
  };

  const previousPageHandler = (e) => {
    e.preventDefault();

    setPagination({
      ...pagination,
      currentPage: pagination.currentPage == 1 ? 1 : pagination.currentPage - 1,
      skip:
        pagination.currentPage == 1
          ? 0
          : (pagination.currentPage - 2) * pagination.limit,
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();

    setPagination({
      ...pagination,
      currentPage:
        pagination.currentPage == pagination.totalPage
          ? pagination.totalPage
          : pagination.currentPage + 1,
      skip:
        pagination.currentPage == pagination.totalPage
          ? 0
          : pagination.currentPage * pagination.limit,
    });
  };

  // Scroll to Div
  useEffect(() => {
    const reftp = document.getElementById("refTP");
    myRef?.current.scrollIntoView();
  }, [parCatSlug, subCatSlug, childCatSlug]);

  return (
    <>
      {/* breadcrumb-area start */}
      <div className="breadcrumb-area section-ptb">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="breadcrumb-title">Shop</h2>
              {/* breadcrumb-list start */}
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <a href="index.html" ref={myRef}>
                    Home
                  </a>
                </li>
                {parCatSlug ? (
                  <li className="breadcrumb-item active">{parCatSlug}</li>
                ) : (
                  ""
                )}
                {subCatSlug ? (
                  <li className="breadcrumb-item active">{subCatSlug}</li>
                ) : (
                  ""
                )}
                {childCatSlug ? (
                  <li className="breadcrumb-item active">{childCatSlug}</li>
                ) : (
                  ""
                )}
              </ul>
              {/* breadcrumb-list end */}
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb-area end */}

      {/* main-content-wrap start */}
      <div className="main-content-wrap shop-page section-ptb">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 order-lg-1 order-2">
              {/* shop-sidebar-wrap start */}
              <div className="shop-sidebar-wrap">
                {/* shop-sidebar start */}
                <div className="shop-sidebar mb--30">
                  <h4 className="title">CATEGORIES</h4>
                  <ul>
                    {categoriesLoading ? (
                      <Spinner />
                    ) : childCategories.length ? (
                      childCategories.map((category, index) => {
                        return (
                          <li key={index}>
                            <Link
                              onClick={(evt) =>
                                setActiveCategory(category.slug)
                              }
                              className={
                                category.slug == activeCategory ? "active" : ""
                              }
                              to={`/${category.par_cat_slug}/${category.cat_slug}/${category.slug}`}
                            >
                              {category.name}
                              <span>({category.products.length})</span>
                            </Link>
                          </li>
                        );
                      })
                    ) : categories.length ? (
                      categories.map((category, index) => {
                        return (
                          <li key={index}>
                            <Link to={`/${parCatSlug}/${category.slug}`}>
                              {category.name}
                              <span>({category.products.length})</span>
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      <div className="text-center">
                        <div className="alert alert-danger">
                          Category Not Available
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
                {/* shop-sidebar end */}

                {/* shop-sidebar start */}
                <div className="shop-sidebar mb--30">
                  <h4 className="title">FILTER BY PRICE</h4>
                  {/* filter-price-content start */}
                  <div className="filter-price-content">
                    <input
                      type="text"
                      class="js-range-slider"
                      name="my_range"
                      value=""
                    />
                    <form
                      action="#"
                      method="post"
                      onSubmit={rangeFilterHandler}
                    >
                      <div id="price-slider" className="price-slider"></div>
                      <div className="filter-price-wapper">
                        <div className="filter-price-cont">
                          <span>Price:</span>
                          <div className="input-type">
                            <input
                              value={range.min}
                              type="text"
                              id="min-price"
                              readonly=""
                            />
                          </div>
                          <span>—</span>
                          <div className="input-type">
                            <input
                              value={range.max}
                              type="text"
                              id="max-price"
                              readonly=""
                            />
                          </div>
                          <button type="submit" className="add-to-cart-button">
                            <span>FILTER</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* filter-price-content end */}
                </div>
                {/* shop-sidebar end */}

                {/* shop-sidebar start */}

                {/* shop-sidebar end */}

                {/* shop-sidebar start */}
                {/*   <div className="shop-sidebar mb--30">
                            <h4 className="title">SIZE</h4>
                            <ul>  
                                <li><a href="shop.html">S <span>(11)</span></a></li>
                                <li><a href="shop.html">M <span>(13)</span></a></li>
                                <li><a href="shop.html">L <span>(6)</span></a></li>
                                <li><a href="shop.html">XLL <span>(51)</span></a></li>
                                <li><a href="shop.html">XXL <span>(3)</span></a></li>
                            </ul>
                        </div> */}
                {/* shop-sidebar end */}

                {/* shop-sidebar start */}
                <div className="shop-sidebar">
                  <h4 className="title">Ranges</h4>
                  <div className="sidebar-tag">
                    {rangeLoading ? (
                      <Spinner />
                    ) : allRanges.length ? (
                      allRanges.map((range, index) => {
                        return (
                          <Link
                            className={activeRange == range.id ? "active" : ""}
                            key={index}
                            to="#"
                            onClick={(evt) => {
                              evt.preventDefault();
                              setFilterRange(range.id);
                              setActiveRange(range.id);
                            }}
                          >
                            {range.name}
                          </Link>
                        );
                      })
                    ) : (
                      <div className="text-center">
                        <div className="alert alert-danger">
                          Range Not Available
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* shop-sidebar end */}
              </div>
              {/* shop-sidebar-wrap end */}
            </div>
            <div className="col-lg-9 order-lg-2 order-1">
              {/* shop-product-wrapper start */}
              <div className="shop-product-wrapper">
                <div className="row">
                  <div className="col">
                    {/* shop-top-bar start */}
                    <div className="shop-top-bar">
                      {/* product-view-mode start */}
                      <div className="product-view-mode">
                        {/* shop-item-filter-list start */}
                        <ul
                          role="tablist"
                          className="nav shop-item-filter-list"
                        >
                          <li role="presentation" className="active">
                            <a
                              href="#grid"
                              aria-controls="grid"
                              role="tab"
                              data-bs-toggle="tab"
                              className="active show"
                              aria-selected="true"
                            >
                              <i className="ion-ios-keypad-outline"></i>
                            </a>
                          </li>
                          <li role="presentation">
                            <a
                              href="#list"
                              aria-controls="list"
                              role="tab"
                              data-bs-toggle="tab"
                            >
                              <i className="ion-ios-list-outline"></i>
                            </a>
                          </li>
                        </ul>
                        {/* shop-item-filter-list end */}
                      </div>
                      {/* product-view-mode end */}
                      {/* product-short start */}
                      <div className="product-short">
                        <p>Sort By:</p>
                        <select
                          onChange={(evt) => {
                            setSort(evt.target.value);
                          }}
                          className="nice-select"
                          name="sortby"
                        >
                          <option value="default">Default</option>
                          <option value="name-a-z">Name (A - Z)</option>
                          <option value="name-z-a">Name (Z - A)</option>
                          <option value="price-l-h">{`Price (Low > High)`}</option>
                          <option value="price-h-l">{`Price (High > Low)`}</option>
                        </select>
                      </div>
                      {/* product-short end */}
                    </div>
                    {/* shop-top-bar end */}
                  </div>
                </div>

                {/* shop-products-wrap start */}
                <div className="shop-products-wrap">
                  <div className="tab-content">
                    <div
                      id="grid"
                      className="tab-pane fade active show"
                      role="tabpanel"
                    >
                      <div className="shop-product-wrap">
                        <div className="row">
                          {productsLoading ? (
                            <Spinner />
                          ) : products.length ? (
                            products.map((product, index) => {
                              return (
                                <ProductCard
                                  key={index}
                                  classes="col-lg-4 col-md-4 col-sm-6"
                                  image={product.default_image}
                                  name={product.name}
                                  slug={product.slug}
                                  mrp={product.mrp}
                                  selling_price={product.selling_price}
                                />
                              );
                            })
                          ) : (
                            <div className="text-center">
                              <div className="alert alert-danger">
                                Product Not Available
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div id="list" className="tab-pane fade" role="tabpanel">
                      <div className="shop-product-list-wrap">
                        {products.length
                          ? products.map((product, index) => {
                              return (
                                <div className="row product-layout-list">
                                  <div className="col-lg-4 col-md-5">
                                    {/* single-product-wrap start */}
                                    <div className="single-product-wrap">
                                      <div className="product-image">
                                        <Link to={`/product/${product.slug}`}>
                                          <img
                                            src={product.default_image}
                                            alt=""
                                          />
                                        </Link>
                                      </div>
                                    </div>
                                    {/* single-product-wrap end */}
                                  </div>
                                  <div className="col-lg-8 col-md-7">
                                    <div className="product-content text-start">
                                      <h3>
                                        <Link to={`/product/${product.slug}`}>
                                          {product.name}
                                        </Link>
                                      </h3>
                                      <div className="price-box">
                                        <span className="new-price">
                                          {product.selling_price}
                                        </span>
                                        <span className="old-price">
                                          {product.mrp}
                                        </span>
                                      </div>
                                      {parse(product.description || <p></p>)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
                {/* shop-products-wrap end */}

                {/* paginatoin-area start */}
                <div className="paginatoin-area">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <p>
                        Showing {pagination.skip + 1}-{pagination.limit} of
                        {" " + pagination.totalRecord} item(s)
                      </p>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <ul className="pagination-box">
                        {pagination.currentPage == 1 ? (
                          <li>
                            <span className="Previous text-muted" href="#">
                              Previous
                            </span>
                          </li>
                        ) : (
                          <li>
                            <a
                              onClick={previousPageHandler}
                              className="Previous"
                              href="#"
                            >
                              Previous
                            </a>
                          </li>
                        )}

                        {[...Array(pagination.totalPage)].map((_, i) => {
                          return (
                            <li>
                              <a
                                href="#"
                                onClick={(e) => pageHandler(e, i + 1)}
                              >
                                {i + 1}
                              </a>
                            </li>
                          );
                        })}

                        {pagination.currentPage == pagination.totalPage ? (
                          <li>
                            <span className="Next text-muted" href="#">
                              Next
                            </span>
                          </li>
                        ) : (
                          <li>
                            <a
                              onClick={nextPageHandler}
                              className="Next"
                              href="#"
                            >
                              Next
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* paginatoin-area end */}
              </div>
              {/* shop-product-wrapper end */}
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}
    </>
  );
};

export default Listing;
