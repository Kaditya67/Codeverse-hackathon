import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const NODE_CONFIG = {
  parent: {
    width: 200,
    height: 60,
    verticalSpacing: 150,
    horizontalOffset: 300,
  },
  subtopic: {
    verticalSpacing: 70,
    horizontalOffset: 300,
  },
  colors: {
    parentConnection: "#2c3e50",
    subtopicConnection: "#e74c3c",
  },
};

const CustomNode = ({ data }) => {
  const handleNodeClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div
      style={{
        padding: "12px 20px",
        borderRadius: "10px",
        backgroundColor: "#FFD700",
        border: "2px solid #2c3e50",
        textAlign: "center",
        cursor: data.url ? "pointer" : "default",
        minWidth: `${NODE_CONFIG.parent.width}px`,
        position: "relative",
        boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
        fontSize: "0.9rem",
        fontWeight: 500,
      }}
      onClick={() => handleNodeClick(data.url)}
    >
      {data.label}

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
              width: "12px",
              height: "12px",
              backgroundColor: NODE_CONFIG.colors.parentConnection,
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
              width: "12px",
              height: "12px",
              backgroundColor: NODE_CONFIG.colors.parentConnection,
            }}
          />
          <Handle
            type="source"
            position={data.subtopicSide === "left" ? Position.Left : Position.Right}
            id="subtopic"
            style={{
              [data.subtopicSide === "left" ? "left" : "right"]: "-10px",
              top: "35%",
              backgroundColor: NODE_CONFIG.colors.subtopicConnection,
              width: "10px",
              height: "10px",
            }}
          />
        </>
      ) : (
        <Handle
          type="target"
          position={data.side === "right" ? Position.Left : Position.Right}
          style={{
            [data.side === "right" ? "left" : "right"]: "-10px",
            top: "35%",
            backgroundColor: NODE_CONFIG.colors.subtopicConnection,
            width: "10px",
            height: "10px",
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
  const [language, setLanguage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataAndCreateLayout = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/initroadmap');
        if (!response.ok) throw new Error('Network response was not ok');
        console.log(response);
        const data = await response.json();
        const topics = data["Topics to be covered"];

        // Create parent nodes structure
        const parentNodes = Object.keys(topics).map((topicName, index) => ({
          id: topicName.replace(/\s+/g, '').toLowerCase(),
          label: topicName,
          subtopicSide: index % 2 === 0 ? 'left' : 'right'
        }));

        // Create subtopics structure
        const subtopics = {};
        Object.entries(topics).forEach(([topicName, topicData]) => {
          const parentId = topicName.replace(/\s+/g, '').toLowerCase();
          subtopics[parentId] = topicData["not done"].map(subtopic => ({
            label: subtopic,
            url: "" // Add URL mapping logic here if needed
          }));
        });

        // Calculate layout positions
        const centerX = window.innerWidth / 2;
        let currentY = 80;
        
        const positionedParents = parentNodes.map(parent => {
          const subtopicCount = subtopics[parent.id].length;
          const requiredHeight = Math.max(
            NODE_CONFIG.parent.verticalSpacing,
            subtopicCount * NODE_CONFIG.subtopic.verticalSpacing
          );

          const node = {
            ...parent,
            x: centerX,
            y: currentY,
            requiredHeight,
          };

          currentY += requiredHeight + NODE_CONFIG.parent.verticalSpacing;
          return node;
        });

        // Generate nodes and edges
        const newNodes = [];
        const newEdges = [];

        positionedParents.forEach((parent, index) => {
          // Add parent node
          newNodes.push({
            id: parent.id,
            type: "custom",
            position: { x: parent.x, y: parent.y },
            data: {
              label: parent.label,
              isParent: true,
              subtopicSide: parent.subtopicSide,
            },
            draggable: false,
          });

          // Connect parent nodes
          if (index < positionedParents.length - 1) {
            newEdges.push({
              id: `parent-edge-${parent.id}-${positionedParents[index + 1].id}`,
              source: parent.id,
              target: positionedParents[index + 1].id,
              sourceHandle: "bottom",
              targetHandle: "top",
              type: "smoothstep",
              animated: true,
              style: {
                strokeWidth: 2.5,
                stroke: NODE_CONFIG.colors.parentConnection,
              },
            });
          }

          // Add subtopics
          const subtopicCount = subtopics[parent.id].length;
          const startY = parent.y + (NODE_CONFIG.parent.verticalSpacing / 2) - 
                        ((subtopicCount - 1) * NODE_CONFIG.subtopic.verticalSpacing) / 2;

          subtopics[parent.id].forEach((subtopic, subIndex) => {
            const subId = `${parent.id}-sub-${subIndex}`;
            const xOffset = parent.subtopicSide === "left" 
              ? -NODE_CONFIG.subtopic.horizontalOffset 
              : NODE_CONFIG.subtopic.horizontalOffset;

            newNodes.push({
              id: subId,
              type: "custom",
              position: { 
                x: parent.x + xOffset, 
                y: startY + (subIndex * NODE_CONFIG.subtopic.verticalSpacing)
              },
              data: {
                label: subtopic.label,
                url: subtopic.url,
                side: parent.subtopicSide,
              },
            });

            newEdges.push({
              id: `subtopic-edge-${parent.id}-${subId}`,
              source: parent.id,
              target: subId,
              sourceHandle: "subtopic",
              type: "smoothstep",
              animated: true,
              style: {
                stroke: NODE_CONFIG.colors.subtopicConnection,
                strokeWidth: 2,
              },
            });
          });
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };

    fetchDataAndCreateLayout();
  }, []);

  const handleLanguageSubmit = async (e) => {
    e.preventDefault();
    if (!language) return;
  
    setLoading(true);
    setError(null);
  
    try {
      // Axios request
      const response = await axios.post(
        'http://localhost:8000/api/update-roadmap/',
        { language },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.cookie.replace(
              /(?:(?:^|.*;\s*)csrftoken\s*=\s*([^;]*).*$)|^.*$/,
              '$1'
            ),
          },
        }
      );
  
      // Ensure response data contains expected structure
      const data = response.data;
      console.log("Data:", data);
      if (!data["Topics to be covered"]) {
        throw new Error('Missing "Topics to be covered" in response');
      }
  
      // Define topics structure from response
      const topics = data["Topics to be covered"];
  
      // Generate nodes and edges based on topics and subtopics
      const parentNodes = Object.keys(topics).map((topicName, index) => ({
        id: topicName.replace(/\s+/g, '').toLowerCase(),
        label: topicName,
        subtopicSide: index % 2 === 0 ? 'left' : 'right',
      }));
  
      const subtopics = {};
      Object.entries(topics).forEach(([topicName, topicData]) => {
        const parentId = topicName.replace(/\s+/g, '').toLowerCase();
        subtopics[parentId] = topicData["not done"].map((subtopic) => ({
          label: subtopic,
          url: "", // Add URL mapping logic if needed
        }));
      });
  
      // Positioning logic
      const centerX = window.innerWidth / 2;
      let currentY = 80;
  
      const positionedParents = parentNodes.map((parent) => {
        const subtopicCount = subtopics[parent.id].length;
        const requiredHeight = Math.max(
          NODE_CONFIG.parent.verticalSpacing,
          subtopicCount * NODE_CONFIG.subtopic.verticalSpacing
        );
  
        const node = {
          ...parent,
          x: centerX,
          y: currentY,
          requiredHeight,
        };
  
        currentY += requiredHeight + NODE_CONFIG.parent.verticalSpacing;
        return node;
      });
  
      // Create nodes and edges for the flowchart
      const newNodes = [];
      const newEdges = [];
  
      positionedParents.forEach((parent, index) => {
        newNodes.push({
          id: parent.id,
          type: "custom",
          position: { x: parent.x, y: parent.y },
          data: {
            label: parent.label,
            isParent: true,
            subtopicSide: parent.subtopicSide,
          },
          draggable: false,
        });
  
        // Connect parent nodes
        if (index < positionedParents.length - 1) {
          newEdges.push({
            id: `parent-edge-${parent.id}-${positionedParents[index + 1].id}`,
            source: parent.id,
            target: positionedParents[index + 1].id,
            sourceHandle: "bottom",
            targetHandle: "top",
            type: "smoothstep",
            animated: true,
            style: {
              strokeWidth: 2.5,
              stroke: NODE_CONFIG.colors.parentConnection,
            },
          });
        }
  
        // Add subtopics
        const subtopicCount = subtopics[parent.id].length;
        const startY =
          parent.y +
          NODE_CONFIG.parent.verticalSpacing / 2 -
          (subtopicCount - 1) * NODE_CONFIG.subtopic.verticalSpacing / 2;
  
        subtopics[parent.id].forEach((subtopic, subIndex) => {
          const subId = `${parent.id}-sub-${subIndex}`;
          const xOffset =
            parent.subtopicSide === "left"
              ? -NODE_CONFIG.subtopic.horizontalOffset
              : NODE_CONFIG.subtopic.horizontalOffset;
  
          newNodes.push({
            id: subId,
            type: "custom",
            position: { x: parent.x + xOffset, y: startY + subIndex * NODE_CONFIG.subtopic.verticalSpacing },
            data: {
              label: subtopic.label,
              url: subtopic.url,
              side: parent.subtopicSide,
            },
          });
  
          newEdges.push({
            id: `subtopic-edge-${parent.id}-${subId}`,
            source: parent.id,
            target: subId,
            sourceHandle: "subtopic",
            type: "smoothstep",
            animated: true,
            style: {
              stroke: NODE_CONFIG.colors.subtopicConnection,
              strokeWidth: 2,
            },
          });
        });
      });
  
      // Update state
      setNodes(newNodes);
      setEdges(newEdges);
  
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while updating the roadmap.");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        connectionRadius={20}
      >
        <Controls showInteractive={false} />
        <Background
          color="#e0e0e0"
          gap={40}
          variant="dots"
          size={1}
        />
      </ReactFlow>
  
      {/* Fixed input component at the bottom */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: "400px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          borderRadius: "25px",
          zIndex: 10,
        }}
      >
        <input
          type="text"
          placeholder="Enter language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            marginRight: "10px",
            outline: "none",
          }}
        />
        <button
          onClick={handleLanguageSubmit}
          disabled={loading}
          style={{
            padding: "8px 15px",
            borderRadius: "20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
  
      {/* Error Display (Optional) */}
      {error && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            borderRadius: "5px",
            zIndex: 10,
          }}
        >
          {error}
        </div>
      )}
    </ReactFlowProvider>
  );  
};

export default MindMap;