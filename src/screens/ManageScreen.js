import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  listPayments,
  deletePayment,
  getKWH,
} from "../actions/electricActions";
import ".././index.css";

const ManageScreen = () => {
  const electricKWH = useSelector((state) => state.electricKWH);
  const { loading: kwhLoader, data: currentKwh } = electricKWH;

  const electricList = useSelector((state) => state.electricList);
  const { loading, error, payments } = electricList;

  const electricDelete = useSelector((state) => state.electricDelete);
  const { loading: deleteLoader, success: successDelete } = electricDelete;

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteHandler = (id, image) => {
    if (window.confirm("Are you sure")) {
      dispatch(deletePayment(id, image));
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("userInfo") || successDelete) {
      dispatch(listPayments());
      dispatch(getKWH());
    } else {
      navigate("/");
    }
  }, [dispatch, successDelete]);

  const filteredPayments = useMemo(() => {
    const filtered = payments.filter((val) => {
      if (!searchTerm) return true;
      return (
        val.date.includes(searchTerm.toLowerCase()) ||
        val.paid.includes(searchTerm.toLowerCase()) ||
        val.KWH.includes(searchTerm.toLowerCase())
      );
    });

    // Sort the filtered payments by date
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Change to dateA - dateB for ascending order
    });

    return sorted;
  }, [payments, searchTerm]);

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  // Pagination Logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container>
          <Row>
            <Col>
              {kwhLoader ? (
                <Loader />
              ) : (
                <div className="ManageTitles">
                  KWH: {currentKwh[0]}
                  <br />
                  Last update: {currentKwh[1]}
                </div>
              )}
            </Col>
            <Col>
              <FormControl
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                type="text"
                placeholder="Search...   date / paid / kwh "
                className="w-100 text-center border border-dark"
              />
            </Col>
          </Row>

          {deleteLoader && <Loader />}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>kWh</th>
                <th>paid Data</th>
                <th>Price</th>
                <th>Paid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <Button variant="outline-light">
                      <img
                        onClick={() => openModal(payment.image)}
                        style={{ width: "100px", height: "100px" }}
                        src={payment.image}
                        alt="payment"
                      />
                    </Button>
                  </td>
                  <td>{payment.KWH}</td>
                  <td>
                    <div style={{ width: "110px" }}>
                      {`${payment.date.split("-")[2]}/${
                        payment.date.split("-")[1]
                      }/${payment.date.split("-")[0]}`}
                    </div>
                  </td>
                  <td>{payment.price.toFixed(2)}</td>
                  <td>{payment.paid}</td>
                  <td>
                    <div className="updateDeleteDiv">
                      <LinkContainer to={`/manage/${payment.id}`}>
                        <Button variant="info rounded" className="btn-sm">
                          UPDATE
                        </Button>
                      </LinkContainer>{" "}
                      <Button
                        variant="danger"
                        className="btn-sm rounded"
                        onClick={() => deleteHandler(payment.id, payment.image)}
                      >
                        DELETE
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Pagination */}
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className="page-item">
                <Button onClick={() => paginate(i + 1)} className="page-link">
                  {i + 1}
                </Button>
              </li>
            ))}
          </ul>
        </Container>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Body className="d-flex justify-content-center">
          <img
            src={selectedImage}
            alt="Selected Image"
            style={{ maxWidth: "100%", maxHeight: "600px" }}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageScreen;
