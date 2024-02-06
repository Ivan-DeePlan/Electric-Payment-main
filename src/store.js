import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  electricListReducer,
  electricDetalisReducer,
  electricDeleteReducer,
  electricCreateReducer,
  electricUpdateReducer,
  loginReducer,
  electricKWHReducer,
} from "./reducers/electricReducers";

const reducer = combineReducers({
  login: loginReducer,
  electricKWH: electricKWHReducer,

  electricList: electricListReducer,
  electricDetalis: electricDetalisReducer,
  electricDelete: electricDeleteReducer,
  electricCreate: electricCreateReducer,
  electricUpdate: electricUpdateReducer,
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
