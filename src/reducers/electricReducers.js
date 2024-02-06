import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  PAYMENT_LIST_REQUEST,
  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
  PAYMENT_LIST_RESET,
  PAYMENT_DETAILS_REQUEST,
  PAYMENT_DETAILS_SUCCESS,
  PAYMENT_DETAILS_FAIL,
  PAYMENT_DETAILS_RESET,
  PAYMENT_DELETE_REQUEST,
  PAYMENT_DELETE_SUCCESS,
  PAYMENT_DELETE_FAIL,
  PAYMENT_CREATE_RESET,
  PAYMENT_CREATE_FAIL,
  PAYMENT_CREATE_SUCCESS,
  PAYMENT_CREATE_REQUEST,
  PAYMENT_UPDATE_REQUEST,
  PAYMENT_UPDATE_SUCCESS,
  PAYMENT_UPDATE_FAIL,
  PAYMENT_UPDATE_RESET,
  USER_LOGOUT,
  KWH_REQUEST,
  KWH_SUCCESS,
  KWH_FAIL,
  KWH_RESET,
  KWH_UPDATE_REQUEST,
  KWH_UPDATE_SUCCESS,
  KWH_UPDATE_FAIL,
  KWH_UPDATE_RESET,
} from "../constants/electricConstants";

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { loading: true, user: [] };
    case LOGIN_SUCCESS:
      return {
        loading: false,
        user: action.payload,
      };
    case LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};
export const electricListReducer = (state = { payments: [] }, action) => {
  switch (action.type) {
    case PAYMENT_LIST_REQUEST:
      return { loading: true, payments: [] };
    case PAYMENT_LIST_SUCCESS:
      return {
        loading: false,
        payments: action.payload,
      };
    case PAYMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case PAYMENT_LIST_RESET:
      return { payments: [] };
    default:
      return state;
  }
};
export const electricKWHReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case KWH_REQUEST:
      return { loading: true, data: [] };
    case KWH_SUCCESS:
      return {
        loading: false,
        success: true,
        data: action.payload,
      };
    case KWH_FAIL:
      return { loading: false, error: action.payload };
    case KWH_RESET:
      return { data: [] };
    default:
      return state;
  }
};

export const electricDetalisReducer = (state = { payment: [] }, action) => {
  switch (action.type) {
    case PAYMENT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case PAYMENT_DETAILS_SUCCESS:
      return { loading: false, payment: action.payload };
    case PAYMENT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const electricDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_DELETE_REQUEST:
      return { loading: true };
    case PAYMENT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PAYMENT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const electricCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_CREATE_REQUEST:
      return { loading: true };
    case PAYMENT_CREATE_SUCCESS:
      return { loading: false, success: true, payment: action.payload };
    case PAYMENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PAYMENT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const electricUpdateReducer = (state = { payment: {} }, action) => {
  switch (action.type) {
    case PAYMENT_UPDATE_REQUEST:
      return { loading: true };
    case PAYMENT_UPDATE_SUCCESS:
      return { loading: false, success: true, payment: action.payload };
    case PAYMENT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PAYMENT_UPDATE_RESET:
      return { payment: {} };
    default:
      return state;
  }
};
