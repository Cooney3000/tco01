import { ADD_BELEGUNG } from "../constants/action-types";

export function addBelegung(payload) {
  return { type: ADD_BELEGUNG, payload }
};
