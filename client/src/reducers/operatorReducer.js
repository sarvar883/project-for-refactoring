import {
  GET_SORTED_ORDERS,
  SET_LOADING_SORTED_ORDERS
} from '../actions/types';

const initialState = {
  sortedOrders: [],
  date: {},
  loadingSortedOrders: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_SORTED_ORDERS:
      return {
        ...state,
        loadingSortedOrders: true
      };

    case GET_SORTED_ORDERS:
      return {
        ...state,
        sortedOrders: action.payload,
        date: action.date,
        loadingSortedOrders: false
      };

    default:
      return state;
  }
}