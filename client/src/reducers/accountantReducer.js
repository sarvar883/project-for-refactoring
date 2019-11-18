import {
  GET_ACC_QUERIES,
  GET_ACC_QUERY_BY_ID,
  LOADING_ACC_QUERIES
} from '../actions/types';


const initialState = {
  queries: [],
  queryById: {
    disinfectorId: {},
    userCreated: {},
    clientId: {},
    userAcceptedOrder: {},
    disinfectors: []
  },

  loadingQueries: false
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

    // loadings
    case LOADING_ACC_QUERIES:
      return {
        ...state,
        loadingQueries: true
      };

    default:
      return state;
  }
}