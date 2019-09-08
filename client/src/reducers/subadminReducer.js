import {
  GET_SORTED_ORDERS_SUBADMIN,
  LOADING_SORTED_ORDERS_SUBADMIN
} from '../actions/types';

const initialState = {
  sortedOrders: [],
  completeOrders: [],
  orderToConfirm: {
    orderId: {},
    disinfectorId: {}
  },
  stats: {
    orders: [],
    completeOrders: []
  },
  loadingSortedOrders: false,
  loadingCompleteOrders: false,
  loadingStats: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_SORTED_ORDERS_SUBADMIN:
      return {
        ...state,
        loadingSortedOrders: true
      };

    case GET_SORTED_ORDERS_SUBADMIN:
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