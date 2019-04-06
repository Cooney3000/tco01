import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import { pruefeZeitraumMiddleware } from "../middleware";
import thunk from "redux-thunk";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  // storeEnhancers(applyMiddleware(
  //                   pruefeZeitraumMiddleware, 
  //                   thunk,
  //                   )),
  applyMiddleware(thunk),
  );
export default store;