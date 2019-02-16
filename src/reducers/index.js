import { ADD_BELEGUNG, FETCH_BEL_REQUESTED, FETCH_BEL_FAILURE, FETCH_BEL_SUCCESS } from "../constants/action-types";

const initialState = {
  isFetching: false,
  error: false,
  belegungen: [],
  remoteBelegungen: [],
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_BELEGUNG) {
    return Object.assign({}, state, { error: false, belegungen: state.belegungen.concat(action.payload) });
  }
  if (action.type === FETCH_BEL_REQUESTED) {
    return Object.assign({}, state, { isFetching: true, error: false });
  }
  if (action.type === FETCH_BEL_SUCCESS) {
    return Object.assign({}, state, { isFetching: false, error: false, belegungen: state.belegungen.concat(action.payload) });
  }
  if (action.type === FETCH_BEL_FAILURE) {
    return Object.assign({}, state, { isFetching: false, error: true });
    // console.log(FETCH_BEL_FAILURE);
  }

  return state;
}

export default rootReducer;