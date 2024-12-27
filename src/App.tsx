import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SessionPage from "./pages/SessionPage";
import StatsPage from "./pages/StatsPage";
import BankrollPage from "./pages/BankrollPage";

function App() {
  return (
    <Layout>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/bankroll" element={<BankrollPage />} />
        </Routes>
      </Container>
    </Layout>
  );
}

export default App;
