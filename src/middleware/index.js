import { ADD_BELEGUNG } from "../constants/action-types";
import { ZEITRAUM_UNGUELTIG } from "../constants/constants";

export function pruefeZeitraumMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      // do your stuff
      if (action.type === ADD_BELEGUNG) {

//////////// WAS GENAU GEHOERT HIER REIN???? WOZU IST DAS GUT??? ////////////////////////
        if (0) {
          return dispatch({ type: ZEITRAUM_UNGUELTIG });
        }
      }
      return next(action);
    };
  };
}
