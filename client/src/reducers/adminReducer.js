import {
  SET_LOADING_ORDER_QUERIES_FOR_ADMIN,
  SET_LOADING_ADMIN_STATS,
  SET_LOADING_DISINFECTORS,
  GET_ORDER_QUERIES_FOR_ADMIN,
  GET_ADMIN_MONTH_STATS,
  GET_ADMIN_WEEK_STATS,
  GET_ALL_DISINFECTORS_FOR_ADMIN,
  ADD_MAT_DISINFECTOR
} from '../actions/types';

const initialState = {
  orderQueries: [],
  disinfectors: [],
  stats: {
    orders: []
  },
  method: '',
  loadingOrderQueries: false,
  loadingStats: false,
  loadingDisinfectors: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_ORDER_QUERIES_FOR_ADMIN:
      return {
        ...state,
        loadingOrderQueries: true
      };

    case SET_LOADING_ADMIN_STATS:
      return {
        ...state,
        loadingStats: true
      };

    case SET_LOADING_DISINFECTORS:
      return {
        ...state,
        loadingDisinfectors: true
      };

    case GET_ORDER_QUERIES_FOR_ADMIN:
      return {
        ...state,
        orderQueries: action.payload,
        loadingOrderQueries: false
      };

    case GET_ADMIN_MONTH_STATS:
      return {
        ...state,
        method: 'month',
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingStats: false
      };

    case GET_ADMIN_WEEK_STATS:
      return {
        ...state,
        method: 'week',
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingStats: false
      };

    case GET_ALL_DISINFECTORS_FOR_ADMIN:
      return {
        ...state,
        disinfectors: action.payload,
        loadingDisinfectors: false
      };

    case ADD_MAT_DISINFECTOR:
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

    default:
      return state;
  }
};