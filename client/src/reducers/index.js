import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import orderReducer from './orderReducer';
import chatReducer from './chatReducer';
import operatorReducer from './operatorReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  order: orderReducer,
  chat: chatReducer,
  operator: operatorReducer
});