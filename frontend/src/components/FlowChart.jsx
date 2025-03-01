import React, { useState, useCallback } from "react";
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import { Box, Button, Input, VStack } from "@chakra-ui/react";

const initialNodes = [
  { id: "1", type: "input", position: { x: 500, y: 50 }, data: { label: "Programming Languages" } },
];

const initialEdges = [];

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [query, setQuery] = useState("");
  const [nodeCount, setNodeCount] = useState(2);
  const [parentNodes, setParentNodes] = useState({ "1": 0 }); // Track number of subnodes under each node

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addSubNode = () => {
    if (!query.trim()) return;

    // Parent node is always the root node (ID: "1")
    const parentId = "1";

    // Track how many subnodes exist under this parent
    const parentSubnodeCount = parentNodes[parentId] || 0;

    // Spread the subnodes horizontally under the same parent
    const newX = 500 + parentSubnodeCount * 200 - 100; // Offset horizontally
    const newY = 150; // All subnodes appear at the same Y level

    const newNode = {
      id: `${nodeCount}`,
      position: { x: newX, y: newY },
      data: { label: query },
    };

    const newEdge = { id: `e${parentId}-${nodeCount}`, source: parentId, target: `${nodeCount}` };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setEdges((prevEdges) => [...prevEdges, newEdge]);

    // Update the count of subnodes under this parent
    setParentNodes((prev) => ({ ...prev, [parentId]: parentSubnodeCount + 1 }));

    setNodeCount(nodeCount + 1);
    setQuery("");
  };

  return (
    <Box width="100vw" height="100vh">
      {/* Input and Add Node Button */}
      <VStack spacing={4} p={4}>
        <Input placeholder="Enter subnode name..." value={query} onChange={(e) => setQuery(e.target.value)} width="300px" />
        
        <Button colorScheme="blue" onClick={addSubNode}>
          Add Subnode
        </Button>
      </VStack>

      {/* React Flow Graph */}
      <Box width="100%" height="85vh" border="1px solid #ddd">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default FlowChart;
