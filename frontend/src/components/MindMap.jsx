import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom Node Component for better readability and reusability
const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#FFD700",
        border: "2px solid black",
        textAlign: "center",
        cursor: data.url ? "pointer" : "default",
        minWidth: "180px",
        position: "relative",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
      }}
      onClick={() => data.url && window.open(data.url, "_blank")}
    >
      {data.label}
      {/* Parent node handles and their connections */}
      {data.isParent ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            style={{
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            style={{
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          <Handle
            type="source"
            position={data.subtopicSide === "left" ? Position.Left : Position.Right}
            id="subtopic"
            style={{
              [data.subtopicSide === "left" ? "left" : "right"]: "-8px",
              top: "30%",
              backgroundColor: "#ff686b",
            }}
          />
        </>
      ) : (
        // Subtopic node handle
        <Handle
          type="target"
          position={data.side === "right" ? Position.Left : Position.Right}
          style={{
            [data.side === "right" ? "left" : "right"]: "-8px",
            top: "30%",
            backgroundColor: "#ff686b",
          }}
        />
      )}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const MindMap = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    // Define parent nodes with adjusted y positions for more vertical space
    const parentNodes = [
      { id: "internet", label: "Internet", x: 400, y: 50, isParent: true, subtopicSide: "left" },
      { id: "languages", label: "Programming Languages", x: 400, y: 200, isParent: true, subtopicSide: "right" },
      { id: "databases", label: "Databases", x: 400, y: 350, isParent: true, subtopicSide: "right" },
      { id: "webDevelopment", label: "Web Development", x: 400, y: 500, isParent: true, subtopicSide: "left" },
      { id: "dataScience", label: "Data Science", x: 400, y: 650, isParent: true, subtopicSide: "right" },
    ];

    // Define subtopics for each parent node
    const subtopics = {
      internet: [
        { label: "How does the internet work?", url: "https://developer.mozilla.org/en-US/docs/Web" },
        { label: "What is HTTP?", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP" },
      ],
      languages: [
        { label: "JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        { label: "Python", url: "https://docs.python.org/3/tutorial/index.html" },
      ],
      databases: [
        { label: "SQL", url: "https://www.w3schools.com/sql/" },
        { label: "NoSQL", url: "https://www.mongodb.com/nosql-explained" },
      ],
      webDevelopment: [
        { label: "HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
        { label: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
        { label: "JavaScript for Web", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction" },
      ],
      dataScience: [
        { label: "Machine Learning", url: "https://www.coursera.org/learn/machine-learning" },
        { label: "Data Analysis", url: "https://www.datacamp.com/courses/intro-to-data-analysis-with-python" },
        { label: "Data Visualization", url: "https://www.datacamp.com/courses/introduction-to-data-visualization-with-python" },
      ],
    };

    // Initialize nodes and edges
    let newNodes = parentNodes.map((node) => ({
      id: node.id,
      type: "custom",
      position: { x: node.x, y: node.y },
      data: { label: node.label, isParent: true, subtopicSide: node.subtopicSide },
      draggable: false,
    }));

    let newEdges = [];

    // Add edges between parent nodes (adjusted for vertical spacing)
    for (let i = 0; i < parentNodes.length - 1; i++) {
      newEdges.push({
        id: `edge-${parentNodes[i].id}-${parentNodes[i + 1].id}`,
        source: parentNodes[i].id,
        target: parentNodes[i + 1].id,
        sourceHandle: "bottom",
        targetHandle: "top",
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 2 },
      });
    }

    // Add subtopic nodes with adjusted vertical positioning
    let parentYOffsets = {};
    parentNodes.forEach((parent) => {
      const numberOfSubtopics = subtopics[parent.id].length;
      let verticalOffset = 0;

      // Increase the distance between parent nodes further for subtopic positioning
      verticalOffset = numberOfSubtopics * 70;  // Adjust for more vertical space between subtopics

      parentYOffsets[parent.id] = verticalOffset;
    });

    // Add subtopics and edges from parent to subtopics
    parentNodes.forEach((parent) => {
      const numberOfSubtopics = subtopics[parent.id].length;

      subtopics[parent.id].forEach((subtopic, index) => {
        const subId = `${parent.id}-sub-${index}`;
        const side = parent.subtopicSide;
        const xOffset = side === "left" ? -250 : 250;  // Move subtopics left or right
        const yPosition = parent.y + parentYOffsets[parent.id] + (index * 70);  // Adjust the vertical spacing for subtopics

        // Add subtopic node
        newNodes.push({
          id: subId,
          type: "custom",
          position: { x: parent.x + xOffset, y: yPosition },
          data: { label: subtopic.label, url: subtopic.url, side },
        });

        // Add edges from parent to subtopic
        newEdges.push({
          id: `edge-${parent.id}-${subId}`,
          source: parent.id,
          target: subId,
          sourceHandle: "subtopic",
          type: "smoothstep",
          animated: true,
          style: { stroke: "#ff686b", strokeWidth: 1.5 },
        });
      });
    });

    // Set the updated nodes and edges to state
    setNodes(newNodes);
    setEdges(newEdges);
    fetch('http://localhost:8000/api/initroadmap')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  
    
  }, []);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        connectionRadius={30}
        nodesDraggable={false}
      >
        <Controls />
        <Background color="#f0f0f0" gap={30} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default MindMap;
