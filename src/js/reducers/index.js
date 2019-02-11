import { ADD_BELEGUNG } from "../constants/action-types";

const initialState = {
  belegungen: []
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_BELEGUNG) {
    return Object.assign({}, state, { belegungen: state.belegungen.concat(action.payload)});
  }
  return state;
}

export default rootReducer;