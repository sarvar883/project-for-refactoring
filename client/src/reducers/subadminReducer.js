import {
  GET_SORTED_ORDERS_SUBADMIN,
  ALL_DISINFECTORS,
  SUBADMIN_ADDS_MATERIAL,
  SUBADMIN_MAT_COM_HISTORY,
  SUBADMIN_MAT_DISTRIB_HISTORY,
  LOADING_SORTED_ORDERS_SUBADMIN,
  SUBADMIN_LOADING,
  SUBADMIN_LOADING_STATS
} from '../actions/types';

const initialState = {
  disinfectors: [],
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
  method: '',
  materialComing: [],
  addMatEvents: [],

  loadingSortedOrders: false,
  loadingCompleteOrders: false,
  loadingStats: false,
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_SORTED_ORDERS_SUBADMIN:
      return {
        ...state,
        loadingSortedOrders: true
      };

    case SUBADMIN_LOADING:
      return {
        ...state,
        loading: true
      };

    case SUBADMIN_LOADING_STATS:
      return {
        ...state,
        loadingStats: true
      };


    case ALL_DISINFECTORS:
      return {
        ...state,
        disinfectors: action.payload,
        loading: false
      };

    case SUBADMIN_ADDS_MATERIAL:
      let disinfectorIndex = state.disinfectors.findIndex(item => item._id.toString() === action.payload.disinfector);
      let array = [...state.disinfectors];
      action.payload.materials.forEach(item => {
        array[disinfectorIndex].materials.forEach(thing => {
          if (thing.material === item.material) {
            thing.amount += Number(item.amount);
            return;
          }
        });
      });
      return {
        ...state,
        disinfectors: array
      };

    case GET_SORTED_ORDERS_SUBADMIN:
      return {
        ...state,
        sortedOrders: action.payload,
        date: action.date,
        loadingSortedOrders: false
      };

    case SUBADMIN_MAT_COM_HISTORY:
      return {
        ...state,
        loadingStats: false,
        method: action.payload.method,
        materialComing: action.payload.events
      };

    case SUBADMIN_MAT_DISTRIB_HISTORY:
      return {
        ...state,
        loadingStats: false,
        method: action.payload.method,
        addMatEvents: action.payload.events
      };

    default:
      return state;
  }
}