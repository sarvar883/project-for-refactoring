import axios from 'axios';
import {
  GET_ERRORS,
  GET_SORTED_ORDERS_SUBADMIN,
  LOADING_SORTED_ORDERS_SUBADMIN
} from './types';


export const getSortedOrders = (date) => (dispatch) => {
  dispatch(setLoadingSortedOrders());
  axios.post('/subadmin/get-sorted-orders', { date: date })
    .then(res =>
      dispatch({
        type: GET_SORTED_ORDERS_SUBADMIN,
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


// Loading sorted orders
export const setLoadingSortedOrders = () => {
  return {
    type: LOADING_SORTED_ORDERS_SUBADMIN
  };
};