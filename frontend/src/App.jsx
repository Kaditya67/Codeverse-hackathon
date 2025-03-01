import React from "react";
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlowChart from "./components/FlowChart";
import LandingPage from "./components/landingPage";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/flowchart" element={<FlowChart />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
