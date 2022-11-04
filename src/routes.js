import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Facilitador from "./pages/Facilitador";
import Familia from "./pages/Familia";
import Login from "./pages/Login";
import Questionarios from "./pages/Questionarios";

const IndexRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/colaboradores" element={<Facilitador />} />
        <Route path="/familias" element={<Familia />} />
        <Route path="/questionarios" element={<Questionarios />} />
      </Routes>
    </Router>
  );
};

export default IndexRouter;
