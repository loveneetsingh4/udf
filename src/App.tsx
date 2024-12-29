import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/index";
import Form from "./components/form/index";
import Table from "./components/table/index";
import Email from "./components/email/index";
import PrivateRoute from "./components/privateRoute/index";

function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Form />} />

            <Route
              path="/users"
              element={<PrivateRoute path="/users" element={<Table />} />}
            />
            <Route path="/email" element={<Email />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
