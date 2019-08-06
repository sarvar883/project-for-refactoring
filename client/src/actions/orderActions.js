import axios from 'axios';
import {
  GET_DISINFECTORS,
  SET_LOADING,
  GET_ERRORS,
  GET_ALL_ORDERS,
  GET_ORDER_BY_ID,
  GET_COMPLETE_ORDERS_IN_MONTH
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
        payload: err
      })
    );
};


// create new order
export const createOrder = (newOrder, history, occupation) => (dispatch) => {
  axios.post('/order/create-order', newOrder)
    .then(res => history.push(`/${occupation}`))
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
    .then(res =>
      dispatch({
        type: GET_ALL_ORDERS,
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


// add disinfector comment to order
export const addDisinfectorComment = (object, history) => (dispatch) => {
  axios.post('/order/addDisinfectorComment', object)
    .then(res => history.push('/disinfector'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// get one order by id
export const getOrderById = (id) => (dispatch) => {
  dispatch(setLoading());
  axios.post('/order/get-order-by-id', { id: id })
    .then(res =>
      dispatch({
        type: GET_ORDER_BY_ID,
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


// submit completed order
export const submitCompleteOrder = (object, history) => (dispatch) => {
  axios.post('/order/submit-complete-order', { order: object })
    .then(res => history.push('/disinfector'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// disinfectors gets his completed orders for some month
export const getCompleteOrdersInMonth = (month, year, disinfectorId) => (dispatch) => {
  dispatch(setLoading());
  axios.post('/order/get-complete-order-in-month', {
    month: month,
    year: year,
    disinfectorId: disinfectorId
  })
    .then(res =>
      dispatch({
        type: GET_COMPLETE_ORDERS_IN_MONTH,
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


// Disinfector loading
export const setLoading = () => {
  return {
    type: SET_LOADING
  };
};