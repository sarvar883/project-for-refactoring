import axios from 'axios';
import {
  GET_ERRORS,
  GET_ALL_DISINFECTORS,
  GET_DISINFECTOR_MATERIALS,
  GET_DISINF_MONTH_STATS,
  GET_DISINF_WEEK_STATS,
  GET_DISINF_DAY_STATS,
  GET_ADD_MATERIAL_EVENTS,
  DISINF_MAT_COMINGS,
  DISINF_MAT_DISTRIBS,
  LOADING_DISINF_STATS,
  SET_LOADING_DISINFECTORS,
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


export const getDayStats = (object) => (dispatch) => {
  dispatch(loadingDisinfStats());
  axios.post('/stats/for-disinfector-day', { object: object })
    .then(res =>
      dispatch({
        type: GET_DISINF_DAY_STATS,
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


export const getAllDisinfectorsAndSubadmins = () => (dispatch) => {
  dispatch(loadingDisinfectors());
  axios.get('/order/get-all-disinfectors')
    .then(res =>
      dispatch({
        type: GET_ALL_DISINFECTORS,
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


// disinfector adds material to other user/disinfector
export const disAddMatToOther = (object, occupation, history) => (dispatch) => {
  axios.post('/order/dis-add-mat-to-other-user', { object: object })
    .then(() => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getUserMatComing = (object) => (dispatch) => {
  dispatch(loadingDisinfStats());
  axios.post('/stats/get-user-mat-coming', { object: object })
    .then(res =>
      dispatch({
        type: DISINF_MAT_COMINGS,
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


export const getUserMatDistrib = (object) => (dispatch) => {
  dispatch(loadingDisinfStats());
  axios.post('/stats/get-user-mat-distrib', { object: object })
    .then(res =>
      dispatch({
        type: DISINF_MAT_DISTRIBS,
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

export const loadingDisinfectors = () => {
  return {
    type: SET_LOADING_DISINFECTORS
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