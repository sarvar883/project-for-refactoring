import axios from 'axios';
import {
  GET_DISINF_STATS,
  LOADING_DISINF_STATS,
  GET_ERRORS
} from './types';


// disinfector gets his stats
export const disinfStats = (id, month, year) => (dispatch) => {
  dispatch(loadingDisinfStats());
  axios.post('/stats/for-disinfector', { id: id, month: month, year: year })
    .then(res =>
      dispatch({
        type: GET_DISINF_STATS,
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