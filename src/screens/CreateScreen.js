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
  const [price, setPrice] = useState(0);
  const [paid, setPaid] = useState("");
  const [date, setDate] = useState();
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [currentKWH, setCurrentKWH] = useState(0);

  const [progressBar, setProgressBar] = useState(0);
  const [upload, setUpload] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const electricKWH = useSelector((state) => state.electricKWH);
  const { data } = electricKWH;
  const [KWH, setKwh] = useState(0);

  const electricCreate = useSelector((state) => state.electricCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = electricCreate;

  const createProductHandler = (e) => {
    e.preventDefault();

    if (currentKWH < KWH) {
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
      alert(`kWh need to be grater then current kWh:${currentKWH}`);
    }
  };

  useEffect(() => {
    dispatch(getKWH);
    if (upload && file && progressBar === 100) {
      dispatch(createPayment(KWH, date, price, paid, image));
      setUpload(false);
    }
    if (data[0]) {
      setCurrentKWH(data[0]);
    }

    if (successCreate) {
      dispatch({ type: PAYMENT_CREATE_RESET });
      dispatch({ type: KWH_RESET });
      alert("Product Created !");
      navigate("/manage");
    }

    setPrice((KWH - currentKWH) * 0.57);
  }, [successCreate, navigate, KWH, file, data, upload, progressBar]);

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
              <Form.Label>is Paid ? </Form.Label>
              <Form.Control
                required
                type="text"
                min={0}
                placeholder="Is Paid"
                value={paid ?? ""}
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
                value={KWH ?? 0}
                onChange={(e) => {
                  setKwh(e.target.value);
                }}
              ></Form.Control>
              <p>current kWh: {currentKWH ? currentKWH : 0}</p>
            </Form.Group>

            <br />
            <Form.Group controlId="Data">
              <Form.Label>Data</Form.Label>
              <Form.Control
                required
                type="Date"
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
                  placeholder="Enter image URL"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                ></Form.Control>
                <ProgressBar
                  now={progressBar}
                  label={`${progressBar}%`}
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
                  value={price.toFixed(2) ?? 0}
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
                if (window.confirm("are you sure ? the Data will be lost")) {
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
