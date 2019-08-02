import {
  GET_SORTED_ORDERS,
  GET_COMPLETE_ORDERS,
  SET_LOADING_SORTED_ORDERS,
  SET_LOADING_COMPLETE_ORDERS
} from '../actions/types';

const initialState = {
  sortedOrders: [],
  completeOrders: [],
  date: {},
  loadingSortedOrders: false,
  loadingCompleteOrders: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_SORTED_ORDERS:
      return {
        ...state,
        loadingSortedOrders: true
      };

    case SET_LOADING_COMPLETE_ORDERS:
      return {
        ...state,
        loadingCompleteOrders: true
      };

    case GET_SORTED_ORDERS:
      return {
        ...state,
        sortedOrders: action.payload,
        date: action.date,
        loadingSortedOrders: false
      };

    case GET_COMPLETE_ORDERS:
      return {
        ...state,
        completeOrders: action.payload,
        loadingCompleteOrders: false
      };

    default:
      return state;
  }
}