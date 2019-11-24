import {
  GET_ACC_QUERIES,
  GET_ACC_QUERY_BY_ID,
  GET_ACC_STATS,
  SEARCH_CONTRACTS,
  LOADING_ACC_QUERIES,
  SET_LOADING_ACC_STATS
} from '../actions/types';


const initialState = {
  orders: [],
  queries: [],
  queryById: {
    disinfectorId: {},
    userCreated: {},
    clientId: {},
    userAcceptedOrder: {},
    disinfectors: []
  },
  stats: {
    method: '',
    orders: []
  },
  loadingQueries: false,
  loadingStats: false
};


export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ACC_QUERIES:
      return {
        ...state,
        queries: action.payload,
        loadingQueries: false
      };

    case GET_ACC_QUERY_BY_ID:
      return {
        ...state,
        queryById: action.payload,
        loadingQueries: false
      };

    case GET_ACC_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          orders: action.payload.orders,
          method: action.payload.method
        },
        loadingStats: false
      };

    case SEARCH_CONTRACTS:
      return {
        ...state,
        orders: action.payload,
        loadingQueries: false
      };


    // loadings
    case LOADING_ACC_QUERIES:
      return {
        ...state,
        loadingQueries: true
      };

    case SET_LOADING_ACC_STATS:
      return {
        ...state,
        loadingStats: true
      };

    default:
      return state;
  }
}