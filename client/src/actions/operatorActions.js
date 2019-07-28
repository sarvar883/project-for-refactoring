import axios from 'axios';
import {
  GET_ERRORS,
  GET_SORTED_ORDERS,
  SET_LOADING_SORTED_ORDERS
} from './types';


export const getSortedOrders = (date) => (dispatch) => {
  dispatch(setLoadingSortedOrders());
  axios.post('/operator/get-sorted-orders', { date: date })
    .then(res =>
      dispatch({
        type: GET_SORTED_ORDERS,
        payload: res.data,
        date: date
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Loading sorted orders
export const setLoadingSortedOrders = () => {
  return {
    type: SET_LOADING_SORTED_ORDERS
  };
};