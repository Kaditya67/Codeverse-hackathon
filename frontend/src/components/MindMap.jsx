import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import TopicNode from "./TopicNode";
import ConnectionLine from "./ConnectionLine";
import roadmapData from "../roadmapData";

const nodeTypes = { topicNode: TopicNode };

const MindMap = ({ onSelectTopic }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    let newNodes = [];
    let newEdges = [];

    roadmapData.topics.forEach((topic, index) => {
      const topicId = `topic-${index}`;
      const subtopicsId = `subtopics-${index}`;

      // Parent Topic Node
      newNodes.push({
        id: topicId,
        type: "topicNode",
        position: { x: 300, y: index * 250 },
        data: { label: topic.label, subtopics: null, onClick: () => onSelectTopic(topic) },
      });

      if (index > 0) {
        // Connect Parent Topics (top to bottom)
        newEdges.push({
          id: `edge-${index - 1}-${index}`,
          source: `topic-${index - 1}`,
          target: topicId,
          type: "smoothstep",
        });
      }

      // Subtopics Node
      newNodes.push({
        id: subtopicsId,
        type: "topicNode",
        position: { x: index % 2 === 0 ? 600 : 0, y: index * 250 },
        data: { label: "Subtopics", subtopics: topic.subtopics, onClick: () => onSelectTopic(topic) },
      });

      // Connect Parent to Subtopics
      newEdges.push({
        id: `edge-${topicId}-${subtopicsId}`,
        source: topicId,
        target: subtopicsId,
        type: "straight",
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  return (
    <ReactFlowProvider>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default MindMap;
