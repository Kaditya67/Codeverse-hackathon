import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import MindMap from "./MindMap";
import TopicDetailsModal from "./TopicDetailsModal";

const FlowChart = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <Box width="100vw" height="100vh">
      <MindMap onSelectTopic={setSelectedTopic} />
      {selectedTopic && (
        <TopicDetailsModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </Box>
  );
};

export default FlowChart;
