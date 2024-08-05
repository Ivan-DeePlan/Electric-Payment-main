import {
  PAYMENT_LIST_REQUEST,
  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
  PAYMENT_LIST_RESET,
  PAYMENT_DETAILS_REQUEST,
  PAYMENT_DETAILS_SUCCESS,
  PAYMENT_DETAILS_FAIL,
  PAYMENT_DETAILS_RESET,
  PAYMENT_DELETE_SUCCESS,
  PAYMENT_DELETE_REQUEST,
  PAYMENT_DELETE_FAIL,
  PAYMENT_CREATE_REQUEST,
  PAYMENT_CREATE_SUCCESS,
  PAYMENT_CREATE_FAIL,
  PAYMENT_UPDATE_REQUEST,
  PAYMENT_UPDATE_SUCCESS,
  PAYMENT_UPDATE_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOGOUT,
  KWH_REQUEST,
  KWH_SUCCESS,
  KWH_FAIL,
  KWH_UPDATE_SUCCESS,
  KWH_UPDATE_FAIL,
  KWH_UPDATE_REQUEST,
} from "../constants/electricConstants";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ref, deleteObject, getStorage } from "firebase/storage";
import { auth } from "../firebase";
import { db } from "../firebase";
import moment from "moment";

export const loginToPaiments = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const date = userCredential.user;

      dispatch({
        type: LOGIN_SUCCESS,
        payload: date,
      });
      localStorage.setItem("userInfo", JSON.stringify(date));
      document.location.href = "/";
    })
    .catch((error) => {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.message,
      });
    });
};

export const logout = () => (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  localStorage.removeItem("userInfo");
  dispatch({ type: PAYMENT_LIST_RESET });
  //dispatch({ type: PAYMENT_DETAILS_RESET });
  document.location.href = "/";
};

export const listPayments = () => async (dispatch) => {
  let data = [];
  try {
    dispatch({ type: PAYMENT_LIST_REQUEST });

    const querySnapshot = await getDocs(collection(db, "payments"));
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    dispatch({
      type: PAYMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PAYMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const PaymentDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PAYMENT_DETAILS_REQUEST });

    const docRef = doc(db, "payments", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      dispatch({
        type: PAYMENT_DETAILS_SUCCESS,
        payload: { ...docSnap.data(), id: docSnap.id },
      });
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    dispatch({
      type: PAYMENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deletePayment = (id, image) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PAYMENT_DELETE_REQUEST,
    });

    await deleteDoc(doc(db, "payments", id));
    await deleteDoc(doc(db, "KWH", id));

    const storage = getStorage();

    const desertRef = ref(storage, image);

    deleteObject(desertRef).catch((error) => {
      throw new Error(error);
    });
    dispatch(getKWH());

    dispatch({
      type: PAYMENT_DELETE_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: PAYMENT_DELETE_FAIL,
      payload: message,
    });
  }
};

export const createPayment =
  (KWH, date, price, paid, image) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PAYMENT_CREATE_REQUEST,
      });

      const data = await addDoc(collection(db, "payments"), {
        KWH: KWH,
        date: date,
        image: image,
        paid: paid,
        price: price,
        updateTime: serverTimestamp(),
      });

      await setDoc(doc(db, "KWH", data.id), {
        KWH: KWH,
        date: date,
        updateTime: serverTimestamp(),
      });

      dispatch({
        type: PAYMENT_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({
        type: PAYMENT_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const updatePayment =
  ({ id, paid, price, KWH, date, image }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: PAYMENT_UPDATE_REQUEST,
      });
      const data = {
        KWH: KWH,
        date: date,
        image: image,
        paid: paid,
        price: price,
      };

      const examcollref = await doc(db, "payments", id);
      updateDoc(examcollref, {
        KWH: KWH,
        date: date,
        image: image,
        paid: paid,
        price: price,
      })
        .then(() => {
          updateDoc(doc(db, "KWH", examcollref.id), {
            KWH: KWH,
            date: date,
            updateTime: serverTimestamp(),
          });
        })
        .then(() => {
          alert("updated");
        })
        .catch((error) => {
          console.log(error.message);
        });

      dispatch({
        type: PAYMENT_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({
        type: PAYMENT_UPDATE_FAIL,
        payload: message,
      });
    }
  };

export const getKWH = () => async (dispatch) => {
  let data = [];
  try {
    dispatch({ type: KWH_REQUEST });
    new Promise(async (resolve, reject) => {
      const querySnapshotKWH = await getDocs(collection(db, "KWH"));
      querySnapshotKWH.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      const maxKwhValue = await Math.max(
        ...data.map((payment) => {
          return payment.KWH;
        })
      );
      const maxDate = new Date(moment().max(data.updateTime));

      resolve([maxKwhValue, moment(new Date(maxDate)).format("DD/MM/YYYY")]);
    }).then((vlalu) => {
      dispatch({
        type: KWH_SUCCESS,
        payload: vlalu,
      });
    });
  } catch (error) {
    dispatch({
      type: KWH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
