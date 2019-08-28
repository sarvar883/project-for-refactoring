import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import orderReducer from './orderReducer';
import chatReducer from './chatReducer';
import operatorReducer from './operatorReducer';
import disinfectorReducer from './disinfectorReducer';
import adminReducer from './adminReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  order: orderReducer,
  chat: chatReducer,
  disinfector: disinfectorReducer,
  operator: operatorReducer,
  admin: adminReducer
});