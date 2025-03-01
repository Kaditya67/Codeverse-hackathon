import React from "react";
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import FlowChart from "./components/FlowChart";

const App = () => {
  return (
    <ChakraProvider>
      <Box textAlign="center" p={5}>
        <Heading>React Flow - Hierarchical Nodes</Heading>
      </Box>
      <FlowChart />
    </ChakraProvider>
  );
};

export default App;