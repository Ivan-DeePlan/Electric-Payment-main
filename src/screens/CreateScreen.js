import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Form, ProgressBar } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import {
  PAYMENT_CREATE_RESET,
  KWH_RESET,
} from "../constants/electricConstants";
import { createPayment, getKWH } from "../actions/electricActions";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const CreateScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for input fields and operations
  const [price, setPrice] = useState(0);
  const [paid, setPaid] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [currentKWH, setCurrentKWH] = useState(0);
  const [KWH, setKwh] = useState(0);

  const [progressBar, setProgressBar] = useState(0);
  const [upload, setUpload] = useState(false);

  // Selectors for Redux state
  const electricKWH = useSelector((state) => state.electricKWH);
  const { data } = electricKWH;

  const electricCreate = useSelector((state) => state.electricCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = electricCreate;

  // Handler for form submission
  const createProductHandler = (e) => {
    e.preventDefault();

    if (KWH > currentKWH) {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressBar(progress);
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
            setUpload(true);
          });
        }
      );
    } else {
      alert(`kWh needs to be greater than current kWh: ${currentKWH}`);
    }
  };

  // Effect hook for fetching data and updating state
  useEffect(() => {
    dispatch(getKWH());
  }, [dispatch]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCurrentKWH(data[0]);
      setKwh(data[0]); // Initialize KWH with the current KWH value
    }
  }, [data]);

  useEffect(() => {
    if (upload && file && progressBar === 100 && image) {
      dispatch(createPayment(KWH, date, price, paid, image));
      setUpload(false);
    }
  }, [dispatch, upload, file, progressBar, image, KWH, date, price, paid]);

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PAYMENT_CREATE_RESET });
      dispatch({ type: KWH_RESET });
      navigate("/");
    }
  }, [dispatch, successCreate, navigate]);

  useEffect(() => {
    // Update the price based on the difference between KWH and currentKWH
    setPrice((KWH - currentKWH) * 0.57);
  }, [KWH, currentKWH]);

  return (
    <Container>
      <FormContainer>
        <h1>Create Payment</h1>

        {loadingCreate ? (
          <Loader />
        ) : (
          <Form onSubmit={createProductHandler}>
            <br />
            <Form.Group controlId="catalogNumber">
              <Form.Label>Is Paid?</Form.Label>
              <Form.Control
                required
                type="text"
                min={0}
                placeholder="Is Paid"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <br />
            <Form.Group controlId="KWH">
              <Form.Label>KWH</Form.Label>

              <Form.Control
                required
                type="number"
                min={0}
                value={KWH}
                onChange={(e) => {
                  setKwh(parseFloat(e.target.value));
                }}
              ></Form.Control>
              <p>Current kWh: {currentKWH}</p>
            </Form.Group>

            <br />
            <Form.Group controlId="Data">
              <Form.Label>Date</Form.Label>
              <Form.Control
                required
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              ></Form.Control>

              <br />
              <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  required
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                ></Form.Control>
                <ProgressBar
                  now={progressBar}
                  label={`${progressBar.toFixed(0)}%`}
                  animated
                />
              </Form.Group>
              <br />
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  required
                  type="number"
                  disabled
                  placeholder="Enter price"
                  value={price.toFixed(2)}
                ></Form.Control>
              </Form.Group>
            </Form.Group>
            <br />
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            <Button className="me-5" type="submit" variant="primary">
              Create
            </Button>
            <Button
              onClick={() => {
                if (window.confirm("Are you sure? The data will be lost.")) {
                  navigate("/manage");
                }
              }}
              className="btn btn-dark my-3"
            >
              Cancel
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default CreateScreen;
