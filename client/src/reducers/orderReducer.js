import {
  GET_DISINFECTORS,
  SET_LOADING,
  GET_ALL_ORDERS,
  ADD_ORDER
} from '../actions/types';

const initialState = {
  disinfectors: [],
  orders: [],
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
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
    default:
      return state;
  }
};