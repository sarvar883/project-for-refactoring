import {
  GET_DISINF_STATS,
  LOADING_DISINF_STATS
} from '../actions/types';

const initialState = {
  stats: {
    orders: []
  },
  loadingDisinfStats: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DISINF_STATS:
      return {
        ...state,
        loadingDisinfStats: true
      };

    case GET_DISINF_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingDisinfStats: false
      };

    default:
      return state;
  };
}