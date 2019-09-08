import {
  SET_LOADING_ORDER_QUERIES_FOR_ADMIN,
  SET_LOADING_ADMIN_STATS,
  SET_LOADING_DISINFECTORS,
  SET_LOADING_ADD_MATERIAL_EVENTS,
  LOADING_SORTED_ORDERS_ADMIN,
  LOADING_CUR_MAT,

  GET_SORTED_ORDERS_ADMIN,
  GET_ORDER_QUERIES_FOR_ADMIN,
  GET_ADMIN_MONTH_STATS,
  GET_ADMIN_WEEK_STATS,
  GET_ALL_DISINFECTORS_FOR_ADMIN,
  GET_ADD_MAT_EVENTS_MONTH,
  GET_ADD_MAT_EVENTS_WEEK,
  DISINF_STATS_MONTH_ADMIN,
  DISINF_STATS_MONTH_WEEK,
  ADD_MAT_DISINFECTOR,
  GET_CURR_MAT_ADMIN,
  UPDATE_MAT_COMING,
  MAT_COMING_MONTH,
  MAT_COMING_WEEK
} from '../actions/types';

const initialState = {
  orderQueries: [],
  disinfectors: [],
  sortedOrders: [],
  currentMaterials: {
    materials: []
  },
  stats: {
    orders: []
  },
  method: '',
  addMatEvents: [],
  materialComing: [],
  addMatEventsMethod: '',
  loadingSortedOrders: false,
  loadingOrderQueries: false,
  loadingStats: false,
  loadingDisinfectors: false,
  loadingAddMatEvents: false,
  loadingCurMat: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_SORTED_ORDERS_ADMIN:
      return {
        ...state,
        loadingSortedOrders: true
      };

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

    case SET_LOADING_ADD_MATERIAL_EVENTS:
      return {
        ...state,
        loadingAddMatEvents: true
      };

    case LOADING_CUR_MAT:
      return {
        ...state,
        loadingCurMat: true
      };

    case GET_SORTED_ORDERS_ADMIN:
      return {
        ...state,
        sortedOrders: action.payload,
        date: action.date,
        loadingSortedOrders: false
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

    case DISINF_STATS_MONTH_ADMIN:
      return {
        ...state,
        method: 'month',
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingStats: false
      };

    case DISINF_STATS_MONTH_WEEK:
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

    case GET_ADD_MAT_EVENTS_MONTH:
      return {
        ...state,
        addMatEvents: action.payload,
        addMatEventsMethod: 'month',
        loadingAddMatEvents: false
      };

    case GET_ADD_MAT_EVENTS_WEEK:
      return {
        ...state,
        addMatEvents: action.payload,
        addMatEventsMethod: 'week',
        loadingAddMatEvents: false
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

    case GET_CURR_MAT_ADMIN:
      return {
        ...state,
        loadingCurMat: false,
        currentMaterials: action.payload
      };

    case UPDATE_MAT_COMING:
      return {
        ...state,
        currentMaterials: action.payload
      };

    case MAT_COMING_MONTH:
      return {
        ...state,
        materialComing: action.payload,
        addMatEventsMethod: 'month',
        loadingStats: false
      };

    case MAT_COMING_WEEK:
      return {
        ...state,
        materialComing: action.payload,
        addMatEventsMethod: 'week',
        loadingStats: false
      };

    default:
      return state;
  }
};