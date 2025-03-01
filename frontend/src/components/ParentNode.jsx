import React from "react";
import { Box, Text } from "@chakra-ui/react";

const ParentNode = ({ data }) => {
  return (
    <Box
      bg="yellow.500"
      p="4"
      borderRadius="md"
      boxShadow="lg"
      border="2px solid black"
      textAlign="center"
      cursor="pointer"
      onClick={data.onClick}
    >
      <Text fontWeight="bold" color="black">{data.label}</Text>
    </Box>
  );
};

export default ParentNode;
