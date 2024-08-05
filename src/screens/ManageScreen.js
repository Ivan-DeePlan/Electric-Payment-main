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

  const userInfo = window.localStorage.getItem("userInfo");

  const deleteHandler = (id, image) => {
    if (userInfo && window.confirm("Are you sure")) {
      dispatch(deletePayment(id, image));
    }
  };

  useEffect(() => {
    dispatch(listPayments());
    dispatch(getKWH());
  }, [dispatch, successDelete]);

  const formatDateString = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Find the most recent payment
  const latestPayment = useMemo(() => {
    if (payments.length === 0) return null;
    return payments.reduce((latest, payment) => {
      const latestDate = new Date(latest.date);
      const paymentDate = new Date(payment.date);
      return paymentDate > latestDate ? payment : latest;
    });
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filter the payments based on the search term matching any field
    return payments
      .filter((payment) => {
        const formattedDate = formatDateString(payment.date);

        return (
          formattedDate.includes(lowerCaseSearchTerm) || // Check formatted date
          payment.paid.toLowerCase().includes(lowerCaseSearchTerm) ||
          payment.KWH.toString().toLowerCase().includes(lowerCaseSearchTerm) ||
          payment.price.toString().toLowerCase().includes(lowerCaseSearchTerm)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
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
         <Row className="align-items-center">
         <Col xs={12} md={6} className="mb-3">
              {kwhLoader ? (
                <Loader />
              ) : (
                <div className="ManageTitles">
                  {latestPayment && (
                    <>
                      KWH: {latestPayment.KWH}
                      <br />
                      Last update: {formatDateString(latestPayment.date)}
                    </>
                  )}
                </div>
              )}
            </Col>
            <Col xs={12} md={6}>
              <FormControl
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                type="text"
                placeholder="Search by date, paid, kWh, price..."
                className="w-100 text-center border border-dark"
                value={searchTerm}
              />
            </Col>
          </Row>

          {deleteLoader && <Loader />}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>kWh</th>
                <th>Paid Date</th>
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
                      {formatDateString(payment.date)}
                    </div>
                  </td>
                  <td>{payment.price.toFixed(2)}</td>
                  <td>{payment.paid}</td>
                  <td>
                    <div className="updateDeleteDiv">
                      {userInfo ? (
                        <>
                          <LinkContainer to={`/manage/${payment.id}`}>
                            <Button variant="info rounded" className="btn-sm">
                              UPDATE
                            </Button>
                          </LinkContainer>{" "}
                          <Button
                            variant="danger"
                            className="btn-sm rounded"
                            onClick={() =>
                              deleteHandler(payment.id, payment.image)
                            }
                          >
                            DELETE
                          </Button>
                        </>
                      ) : (
                        <span>Login to edit</span>
                      )}
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
