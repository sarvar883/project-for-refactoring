import axios from 'axios';
import {
  GET_ERRORS,
  GET_SORTED_ORDERS,
  GET_COMPLETE_ORDERS,
  GET_COMPLETE_ORDER_BY_ID,
  SET_LOADING_SORTED_ORDERS,
  SET_LOADING_COMPLETE_ORDERS
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
        payload: err
      })
    );
};


// operator gets complete orders for confirmation
export const getCompleteOrders = () => (dispatch) => {
  dispatch(setLoadingCompleteOrders());
  axios.post('/operator/get-complete-orders')
    .then(res =>
      dispatch({
        type: GET_COMPLETE_ORDERS,
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


export const getCompleteOrderById = (id) => (dispatch) => {
  dispatch(setLoadingCompleteOrders());
  axios.post(`/operator/get-complete-order-by-id/${id}`)
    .then(res =>
      dispatch({
        type: GET_COMPLETE_ORDER_BY_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// operator confirms completed order
export const confirmCompleteOrder = (object) => (dispatch) => {
  axios.post('/operator/confirm-complete-order', { object: object })
    .then(res => {
      console.log('res', res.data);
    })
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


// Loading complete orders
export const setLoadingCompleteOrders = () => {
  return {
    type: SET_LOADING_COMPLETE_ORDERS
  };
};