import React from "react";
import { Box, Text } from "@chakra-ui/react";

const TopicNode = ({ data }) => {
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
      {data.subtopics && (
        <Box mt="2" p="2" bg="blue.300" borderRadius="md" border="1px solid black">
          {data.subtopics.map((subtopic, index) => (
            <Text key={index} fontSize="sm" color="white">• {subtopic}</Text>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TopicNode;
