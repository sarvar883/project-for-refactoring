import {
  GET_DISINF_MONTH_STATS,
  GET_DISINF_WEEK_STATS,
  GET_ADD_MATERIAL_EVENTS,
  LOADING_DISINF_STATS,
  LOADING_ADD_MATERIAL_EVENTS
} from '../actions/types';

const initialState = {
  stats: {
    orders: [],
    addedMaterials: []
  },
  method: '',
  addMaterialEvents: [],
  loadingDisinfStats: false,
  loadingEvents: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DISINF_STATS:
      return {
        ...state,
        loadingDisinfStats: true
      };

    case LOADING_ADD_MATERIAL_EVENTS:
      return {
        ...state,
        loadingEvents: true
      };

    case GET_DISINF_MONTH_STATS:
      return {
        ...state,
        method: 'month',
        stats: {
          ...state.stats,
          orders: action.payload.orders,
          addedMaterials: action.payload.addedMaterials
        },
        loadingDisinfStats: false
      };

    case GET_DISINF_WEEK_STATS:
      return {
        ...state,
        method: 'week',
        stats: {
          ...state.stats,
          orders: action.payload.orders,
          addedMaterials: action.payload.addedMaterials
        },
        loadingDisinfStats: false
      };

    case GET_ADD_MATERIAL_EVENTS:
      return {
        ...state,
        addMaterialEvents: action.payload,
        loadingEvents: false
      };

    default:
      return state;
  };
}