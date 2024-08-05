import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import LoginScreen from "./screens/LoginScreen";
import ManageScreen from "./screens/ManageScreen";
import CreateScreen from "./screens/CreateScreen";
import UpdateScreen from "./screens/UpdateScreen";

function App() {
  const userInfo = window.localStorage.getItem("userInfo");

  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/" element={<ManageScreen />} />
            <Route
              path="/create"
              element={userInfo ? <CreateScreen /> : <Navigate to="/" />}
            />
            <Route
              path="/manage/:id"
              element={userInfo ? <UpdateScreen /> : <Navigate to="/" />}
            />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;