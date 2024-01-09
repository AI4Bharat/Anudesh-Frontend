// store.js

import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage";
import combineReducers from "../reducers";
import C from "../constants";
import { createWrapper } from "next-redux-wrapper";

const config = {
  key: "root",
  storage,
};

const appReducer = persistCombineReducers(config, combineReducers);
const rootReducer = (state, action) => {
  if (action.type === C.LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

const logger = createLogger();

const makeStore = () => {
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, logger)) // <-- Potential issue here
  );

  return store;
};

export const wrapper = createWrapper(makeStore, { debug: true });
