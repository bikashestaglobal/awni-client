export const initialState = {
  jwtToken: null,
  cart: [],
  shipping: {
    pincode: "",
    method: "",
    amount: "",
    date: "",
    startTime: "",
    endTime: "",
  },
  adonCart: [],
  coupon: {},
};

const updateItemToLocalStorage = (item) => {
  localStorage.setItem("customerInfo", JSON.stringify({ ...item }));
};

export const customerReducer = (state, action) => {
  if (action.type == "CUSTOMER") {
    return { ...state, jwtToken: action.payload };
  } else if (action.type == "CLEAR") {
    return initialState;
  } else if (action.type == "ADD_TO_CART") {
    updateItemToLocalStorage({
      ...state,
      cart: [...state.cart, action.payload],
    });
    return { ...state, cart: [...state.cart, action.payload] };
  } else if (action.type == "UPDATE_STATE") {
    return { ...state, ...action.payload };
  } else if (action.type == "INCREASE_QUANTITY") {
    updateItemToLocalStorage({
      ...state,
      cart: state.cart.map((item) =>
        item.productId == action.payload.productId
          ? { ...item, quantity: item.quantity + 1 }
          : { ...item }
      ),
    });
    return {
      ...state,
      cart: state.cart.map((item) =>
        item.productId == action.payload.productId
          ? { ...item, quantity: item.quantity + 1 }
          : { ...item }
      ),
    };
  } else if (action.type == "DECREASE_QUANTITY") {
    updateItemToLocalStorage({
      ...state,
      cart: state.cart.map((item) => {
        return item.productId == action.payload.productId
          ? { ...item, quantity: item.quantity - 1 }
          : { ...item };
      }),
    });
    return {
      ...state,
      cart: state.cart.map((item) => {
        return item.productId == action.payload.productId
          ? { ...item, quantity: item.quantity - 1 }
          : { ...item };
      }),
    };
  } else if (action.type == "CLEAR_CART") {
    updateItemToLocalStorage({ ...state, cart: [] });
    return { ...state, cart: [] };
  } else if (action.type == "REMOVE_FROM_CART") {
    updateItemToLocalStorage({
      ...state,
      cart: state.cart.filter((c) => c.productId !== action.payload.productId),
    });
    return {
      ...state,
      cart: state.cart.filter((c) => c.productId !== action.payload.productId),
    };
  } else if (action.type == "SHIPPING_METHOD") {
    updateItemToLocalStorage({
      ...state,
      shipping: { ...state.shipping, ...action.payload },
    });
    return {
      ...state,
      shipping: { ...state.shipping, ...action.payload },
    };
  } else if (action.type == "CLEAR_SHIPPING_METHOD") {
    updateItemToLocalStorage({
      ...state,
      shipping: initialState.shipping,
    });
    return {
      ...state,
      shipping: initialState.shipping,
    };
  } else if (action.type == "ADD_ADON_TO_CART") {
    updateItemToLocalStorage({
      ...state,
      adonCart: [...state.adonCart, action.payload],
    });
    return { ...state, adonCart: [...state.adonCart, action.payload] };
  } else if (action.type == "INCREASE_ADON_QUANTITY") {
    updateItemToLocalStorage({
      ...state,
      adonCart: state.adonCart.map((item) =>
        item.productId == action.payload.productId
          ? { ...item, quantity: item.quantity + 1 }
          : { ...item }
      ),
    });
    return {
      ...state,
      adonCart: state.adonCart.map((item) =>
        item.productId == action.payload.productId
          ? { ...item, quantity: item.quantity + 1 }
          : { ...item }
      ),
    };
  } else if (action.type == "DECREASE_ADON_QUANTITY") {
    updateItemToLocalStorage({
      ...state,
      adonCart: state.adonCart.map((item) => {
        return item.productId == action.payload.productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : { ...item };
      }),
    });
    return {
      ...state,
      adonCart: state.adonCart.map((item) => {
        return item.productId == action.payload.productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : { ...item };
      }),
    };
  } else if (action.type == "REMOVE_ADON_FROM_CART") {
    updateItemToLocalStorage({
      ...state,
      adonCart: state.adonCart.filter(
        (c) => c.productId !== action.payload.productId
      ),
    });
    return {
      ...state,
      adonCart: state.adonCart.filter(
        (c) => c.productId !== action.payload.productId
      ),
    };
  } else if (action.type == "CLEAR_ADON_CART") {
    updateItemToLocalStorage({ ...state, adonCart: [] });
    return { ...state, adonCart: [] };
  } else if (action.type == "ADD_COUPON") {
    updateItemToLocalStorage({
      ...state,
      coupon: action.payload,
    });
    return { ...state, coupon: action.payload };
  } else {
    return state;
  }
};
