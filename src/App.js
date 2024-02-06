import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import LoginScreen from "./screens/LoginScreen";
import ManageScreen from "./screens/ManageScreen";
import CreateScreen from "./screens/CreateScreen";
import UpdateScreen from "./screens/UpdateScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<LoginScreen />}></Route>
            <Route path="/manage" element={<ManageScreen />}></Route>
            <Route path="/create" element={<CreateScreen />}></Route>
            <Route path="/manage/:id" element={<UpdateScreen />}></Route>
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
