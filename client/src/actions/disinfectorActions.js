import axios from 'axios';
import {
  GET_ERRORS,
  GET_DISINFECTOR_MATERIALS,
  GET_DISINF_MONTH_STATS,
  GET_DISINF_WEEK_STATS,
  GET_ADD_MATERIAL_EVENTS,
  LOADING_DISINF_STATS,
  LOADING_CURRENT_DISINFECTOR,
  LOADING_ADD_MATERIAL_EVENTS
} from './types';


// disinfector gets his monthly stats
export const getMonthStats = (id, month, year) => (dispatch) => {
  dispatch(loadingDisinfStats());
  axios.post('/stats/for-disinfector-month', { id: id, month: month, year: year })
    .then(res =>
      dispatch({
        type: GET_DISINF_MONTH_STATS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};



// disinfector gets his weekly stats
export const getWeekStats = (id, days) => (dispatch) => {
  dispatch(loadingDisinfStats());
  axios.post('/stats/for-disinfector-week', { id: id, days: days })
    .then(res =>
      dispatch({
        type: GET_DISINF_WEEK_STATS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getDisinfectorMaterials = (id) => (dispatch) => {
  dispatch(loadingCurrentDisinfector());
  axios.post('/auth/get-disinfector-materials', { id: id })
    .then(res =>
      dispatch({
        type: GET_DISINFECTOR_MATERIALS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getAddedMaterialEvents = (id) => (dispatch) => {
  dispatch(loadingAddMaterialEvents());
  axios.post('/order/get-add-material-events', { id: id })
    .then(res =>
      dispatch({
        type: GET_ADD_MATERIAL_EVENTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const loadingDisinfStats = () => {
  return {
    type: LOADING_DISINF_STATS
  };
}


export const loadingCurrentDisinfector = () => {
  return {
    type: LOADING_CURRENT_DISINFECTOR
  };
}


export const loadingAddMaterialEvents = () => {
  return {
    type: LOADING_ADD_MATERIAL_EVENTS
  };
}