import {
  GET_DISINFECTORS,
  SET_LOADING,
  SET_LOADING_REPEAT_ORDER,
  GET_ALL_ORDERS,
  ADD_ORDER,
  GET_ORDER_BY_ID,
  SEARCH_ORDERS,
  GET_REPEAT_ORDER_FORM,
  GET_COMPLETE_ORDERS_IN_MONTH
} from '../actions/types';

const initialState = {
  disinfectors: [],
  orders: [],
  orderById: {
    disinfectorId: {}
  },
  repeatOrder: {
    disinfectorId: {},
    previousOrder: {},
    userCreated: {}
  },
  completeOrdersInMonth: [],
  loading: false,
  loadingRepeatOrder: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };

    case SET_LOADING_REPEAT_ORDER:
      return {
        ...state,
        loadingRepeatOrder: true
      };

    case GET_DISINFECTORS:
      return {
        ...state,
        disinfectors: action.payload,
        loading: false
      };

    case GET_ALL_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false
      };

    case ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };

    case GET_ORDER_BY_ID:
      return {
        ...state,
        orderById: action.payload,
        loading: false
      };

    case SEARCH_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false
      };

    case GET_REPEAT_ORDER_FORM:
      return {
        ...state,
        repeatOrder: action.payload,
        loadingRepeatOrder: false
      };

    case GET_COMPLETE_ORDERS_IN_MONTH:
      return {
        ...state,
        completeOrdersInMonth: action.payload,
        loading: false
      };

    default:
      return state;
  }
};