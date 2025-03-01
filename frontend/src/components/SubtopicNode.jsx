import React from "react";
import { Box, Text } from "@chakra-ui/react";

const SubtopicNode = ({ data }) => {
  return (
    <Box
      bg="blue.500"
      p="4"
      borderRadius="lg"
      boxShadow="lg"
      border="2px solid black"
      textAlign="center"
      cursor="pointer"
      onClick={data.onClick}
    >
      <Text fontWeight="bold" color="white">{data.label}</Text>
    </Box>
  );
};

export default SubtopicNode;
