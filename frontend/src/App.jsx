import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FlowChart from "./components/FlowChart";
import LandingPage from "./components/LandingPage";
import ChatBot from "./components/ChatBot";

const App = () => {
  return (
    <ChakraProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/flowchart" element={<FlowChart />} />
            <Route path="/learn" element={<ChatBot />} />
          </Routes>
        </Router>
      </DndProvider>
    </ChakraProvider>
  );
};

export default App;
