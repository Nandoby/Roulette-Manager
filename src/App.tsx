import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SessionPage from "./pages/SessionPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Layout>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Container>
    </Layout>
  );
}

export default App;
