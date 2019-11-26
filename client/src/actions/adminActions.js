import axios from 'axios';
import {
  GET_ERRORS,

  SET_LOADING_ORDER_QUERIES_FOR_ADMIN,
  SET_LOADING_ADMIN_STATS,
  SET_LOADING_DISINFECTORS,
  SET_LOADING_OPERATORS,
  SET_LOADING_ADD_MATERIAL_EVENTS,
  LOADING_SORTED_ORDERS_ADMIN,
  LOADING_CUR_MAT,
  LOADING_CLIENTS,

  GET_SORTED_ORDERS_ADMIN,
  GET_ORDER_QUERIES_FOR_ADMIN,
  GET_ADMIN_MONTH_STATS,
  GET_ADMIN_WEEK_STATS,
  GET_ADV_STATS,
  GET_OPERATOR_STATS,
  GET_ALL_DISINFECTORS_FOR_ADMIN,
  GET_ALL_OPERATORS_FOR_ADMIN,
  GET_ADD_MAT_EVENTS_MONTH,
  GET_ADD_MAT_EVENTS_WEEK,
  DISINF_STATS_MONTH_ADMIN,
  DISINF_STATS_MONTH_WEEK,
  ADD_MAT_DISINFECTOR,
  GET_CURR_MAT_ADMIN,
  UPDATE_MAT_COMING,
  MAT_COMING_MONTH,
  MAT_COMING_WEEK,
  SEARCH_CLIENTS,
  GET_USER_BY_ID
} from './types';


export const getSortedOrders = (date) => (dispatch) => {
  dispatch(setLoadingSortedOrders());
  axios.post('/admin/get-sorted-orders', { date: date })
    .then(res =>
      dispatch({
        type: GET_SORTED_ORDERS_ADMIN,
        payload: res.data,
        date: date
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getQueriesForAdmin = () => (dispatch) => {
  dispatch(setLoadingQueriesForAdmin());
  axios.post('/admin/get-order-queries-for-admin')
    .then(res =>
      dispatch({
        type: GET_ORDER_QUERIES_FOR_ADMIN,
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


export const adminConfirmsOrderQuery = (object, history) => (dispatch) => {
  axios.post('/admin/admin-confirms-order-query', { object: object })
    .then(() => history.push('/admin'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getMonthStatsForAdmin = (month, year) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/for-admin-month', { month: month, year: year })
    .then(res =>
      dispatch({
        type: GET_ADMIN_MONTH_STATS,
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


export const getWeekStatsForAdmin = (days) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/for-admin-week', { days: days })
    .then(res =>
      dispatch({
        type: GET_ADMIN_WEEK_STATS,
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


// advertising statistics
export const getAdvStats = (object) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/adv-stats', { object: object })
    .then(res =>
      dispatch({
        type: GET_ADV_STATS,
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


// get operator stats
export const getOperatorStats = (object) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/operator-stats', { object: object })
    .then(res =>
      dispatch({
        type: GET_OPERATOR_STATS,
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
  axios.post('/admin/get-all-disinfectors-and-subadmins')
    .then(res =>
      dispatch({
        type: GET_ALL_DISINFECTORS_FOR_ADMIN,
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


export const getAllOperators = () => (dispatch) => {
  dispatch(loadingOperators());
  axios.post('/admin/get-all-operators')
    .then(res =>
      dispatch({
        type: GET_ALL_OPERATORS_FOR_ADMIN,
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

export const addMaterialToDisinfector = (object, occupation, history) => (dispatch) => {
  axios.post('/admin/add-materials-to-disinfector', { object: object })
    .then(res => {
      dispatch({
        type: ADD_MAT_DISINFECTOR,
        payload: res.data
      });
      return history.push(`/${occupation}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getAddMaterialEventsMonth = (month, year) => (dispatch) => {
  dispatch(loadingAddMatEvents());
  axios.post('/admin/get-add-material-events-month', { month: month, year: year })
    .then(res =>
      dispatch({
        type: GET_ADD_MAT_EVENTS_MONTH,
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


export const getAddMaterialEventsWeek = (days) => (dispatch) => {
  dispatch(loadingAddMatEvents());
  axios.post('/admin/get-add-material-events-week', { days: days })
    .then(res =>
      dispatch({
        type: GET_ADD_MAT_EVENTS_WEEK,
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


export const getDisinfStatsMonthForAdmin = (id, month, year) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/for-admin-disinf-stats-month', { id: id, month: month, year: year })
    .then(res =>
      dispatch({
        type: DISINF_STATS_MONTH_ADMIN,
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


export const getDisinfStatsWeekForAdmin = (id, days) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/for-admin-disinf-stats-week', { id: id, days: days })
    .then(res =>
      dispatch({
        type: DISINF_STATS_MONTH_WEEK,
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


export const getCurrentMaterials = () => (dispatch) => {
  dispatch(loadingCurMat());
  axios.post('/admin/get-current-materials')
    .then(res =>
      dispatch({
        type: GET_CURR_MAT_ADMIN,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


// add material coming
export const addMatComing = (object, history) => (dispatch) => {
  axios.post('/admin/add-mat-coming', { object: object })
    .then(res => {
      dispatch({
        type: UPDATE_MAT_COMING,
        payload: res.data
      });
      history.push('/admin');
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


// get material coming events in month
export const getMatComMonth = (month, year) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/admin/get-mat-coming-month', { month: month, year: year })
    .then(res =>
      dispatch({
        type: MAT_COMING_MONTH,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


// get material coming events in week
export const getMatComWeek = (days) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/admin/get-mat-coming-week', { days: days })
    .then(res =>
      dispatch({
        type: MAT_COMING_WEEK,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


export const addClient = (object, history, occupation) => (dispatch) => {
  axios.post('/admin/add-client', { object: object })
    .then(res => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};


export const searchClients = (object) => (dispatch) => {
  dispatch(loadingClients());
  axios.post('/admin/search-clients', { object: object })
    .then(res =>
      dispatch({
        type: SEARCH_CLIENTS,
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


export const changePassword = (object, history) => (dispatch) => {
  axios.post('/change-password', { object: object })
    .then(() => history.push('/admin/users'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getUserById = (userId) => (dispatch) => {
  axios.post('/get-user-by-id', { userId: userId })
    .then(res =>
      dispatch({
        type: GET_USER_BY_ID,
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


export const editUser = (object, history) => (dispatch) => {
  axios.post('/edit-user', { object: object })
    .then(() => history.push('/admin/users'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};



// Loading sorted orders
export const setLoadingSortedOrders = () => {
  return {
    type: LOADING_SORTED_ORDERS_ADMIN
  };
};


// Loading order queries for admin
export const setLoadingQueriesForAdmin = () => {
  return {
    type: SET_LOADING_ORDER_QUERIES_FOR_ADMIN
  };
};


// Loading stats for admin
export const loadingStats = () => {
  return {
    type: SET_LOADING_ADMIN_STATS
  };
}


// Loading disinfectors for admin
export const loadingDisinfectors = () => {
  return {
    type: SET_LOADING_DISINFECTORS
  };
}


// Loading operators for admin
export const loadingOperators = () => {
  return {
    type: SET_LOADING_OPERATORS
  };
}


// Loading add material events for admin
export const loadingAddMatEvents = () => {
  return {
    type: SET_LOADING_ADD_MATERIAL_EVENTS
  };
}


// loading current materials
export const loadingCurMat = () => {
  return {
    type: LOADING_CUR_MAT
  };
}

export const loadingClients = () => {
  return {
    type: LOADING_CLIENTS
  };
}