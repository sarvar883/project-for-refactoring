import axios from 'axios';
import {
  GET_DISINFECTORS,
  SET_LOADING,
  GET_ERRORS,
  GET_ALL_ORDERS
  // ADD_ORDER
} from './types';


// get all disinfectors
export const getDisinfectors = () => dispatch => {
  dispatch(setLoading());
  axios
    .get('/order/get-all-disinfectors')
    .then(disinfectors => {
      dispatch({
        type: GET_DISINFECTORS,
        payload: disinfectors
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// create new order
export const createOrder = (newOrder, history) => (dispatch) => {
  axios.post('/order/create-order', newOrder)
    .then(res => {
      // dispatch({
      //   type: ADD_ORDER,
      //   payload: res.data
      // });
      return history.push('/');
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// get orders for logged in disinfector
export const getOrders = (userId) => (dispatch) => {
  dispatch(setLoading());
  axios.post('/order/get-my-orders', { userId: userId })
    .then(orders =>
      dispatch({
        type: GET_ALL_ORDERS,
        payload: orders
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// add disinfector comment to order
export const addDisinfectorComment = (object, history) => (dispatch) => {
  axios.post('/order/addDisinfectorComment', object)
    .then(res => history.push('/disinfector'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Disinfector loading
export const setLoading = () => {
  return {
    type: SET_LOADING
  };
};