import React, { useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Box,
  Button,
  Input,
  VStack,
  Checkbox,
  Text,
  Heading,
  Divider,
  Stack,
  useToast,
} from "@chakra-ui/react";

const initialNodes = [
  { id: "1", type: "input", position: { x: 500, y: 100 }, data: { label: "Programming Languages" } },
];

const initialEdges = [];

const Roadmap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [query, setQuery] = useState("");
  const [nodeCount, setNodeCount] = useState(2);
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [selectedEdges, setSelectedEdges] = useState(new Set());
  const [selectedParent, setSelectedParent] = useState(null);
  const toast = useToast();

  // Function to add a new node
  const addNewNode = () => {
    if (!query.trim()) return;

    const newX = 500 + (Math.random() * 300 - 150);
    const newY = 200 + nodes.length * 100;

    const newNode = {
      id: `${nodeCount}`,
      position: { x: newX, y: newY },
      data: { label: query },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setNodeCount(nodeCount + 1);
    setQuery("");
  };

  // Function to delete selected nodes
  const deleteSelectedNodes = () => {
    if (selectedNodes.size === 0) return;

    setNodes((prevNodes) => prevNodes.filter((node) => !selectedNodes.has(node.id)));
    setEdges((prevEdges) => prevEdges.filter((edge) => !selectedNodes.has(edge.source) && !selectedNodes.has(edge.target)));

    setSelectedNodes(new Set());
    toast({
      title: "Nodes Deleted",
      description: "Selected nodes have been removed.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  // Function to delete selected edges
  const deleteSelectedEdges = () => {
    if (selectedEdges.size === 0) return;

    setEdges((prevEdges) => prevEdges.filter((edge) => !selectedEdges.has(edge.id)));
    setSelectedEdges(new Set());

    toast({
      title: "Connections Deleted",
      description: "Selected connections have been removed.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  // Function to toggle node selection
  const toggleNodeSelection = (nodeId) => {
    setSelectedNodes((prevSelected) => {
      const newSelection = new Set(prevSelected);
      newSelection.has(nodeId) ? newSelection.delete(nodeId) : newSelection.add(nodeId);
      return newSelection;
    });
  };

  // Function to select a parent node
  const selectParentNode = (nodeId) => {
    setSelectedParent(nodeId);
  };

  // Function to toggle edge selection
  const toggleEdgeSelection = (edgeId) => {
    setSelectedEdges((prevSelected) => {
      const newSelection = new Set(prevSelected);
      newSelection.has(edgeId) ? newSelection.delete(edgeId) : newSelection.add(edgeId);
      return newSelection;
    });
  };

  // Function to connect selected nodes to a parent
  const connectNodesToParent = () => {
    if (!selectedParent || selectedNodes.size === 0) return;

    const newEdges = Array.from(selectedNodes).map((childId) => ({
      id: `e${selectedParent}-${childId}`,
      source: selectedParent,
      target: childId,
      animated: true,
    }));

    setEdges((prevEdges) => [...prevEdges, ...newEdges]);

    toast({
      title: "Nodes Connected",
      description: "Selected nodes have been linked to the parent.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar Panel */}
      <Box width="320px" p={6} bg="gray.100" overflowY="auto" borderRight="1px solid #ddd">
        <Heading size="md" mb={4}>Roadmap Editor</Heading>

        {/* Input Field */}
        <Stack spacing={3}>
          <Input placeholder="Enter node name..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button colorScheme="blue" onClick={addNewNode}>Add Node</Button>
        </Stack>

        <Divider my={4} />

        {/* Node Selection */}
        <Text fontWeight="bold" mb={2}>Select Nodes:</Text>
        <VStack align="start" spacing={2} maxHeight="120px" overflowY="auto">
          {nodes.map((node) => (
            <Checkbox key={node.id} isChecked={selectedNodes.has(node.id)} onChange={() => toggleNodeSelection(node.id)}>
              {node.data.label}
            </Checkbox>
          ))}
        </VStack>

        <Divider my={4} />

        {/* Parent Node Selection */}
        <Text fontWeight="bold" mb={2}>Select Parent Node:</Text>
        <VStack align="start" spacing={2} maxHeight="120px" overflowY="auto">
          {nodes.map((node) => (
            <Button
              key={node.id}
              size="sm"
              colorScheme={selectedParent === node.id ? "green" : "gray"}
              onClick={() => selectParentNode(node.id)}
            >
              {node.data.label}
            </Button>
          ))}
        </VStack>

        <Button mt={3} colorScheme="purple" onClick={connectNodesToParent} isDisabled={!selectedParent || selectedNodes.size === 0}>
          Connect Selected Nodes
        </Button>

        <Divider my={4} />

        {/* Edge Selection for Deletion */}
        <Text fontWeight="bold" mb={2}>Delete Connections:</Text>
        <VStack align="start" spacing={2} maxHeight="120px" overflowY="auto">
          {edges.map((edge) => (
            <Checkbox key={edge.id} isChecked={selectedEdges.has(edge.id)} onChange={() => toggleEdgeSelection(edge.id)}>
              {`${edge.source} → ${edge.target}`}
            </Checkbox>
          ))}
        </VStack>

        <Button mt={3} colorScheme="red" onClick={deleteSelectedNodes} isDisabled={selectedNodes.size === 0}>
          Delete Selected Nodes
        </Button>

        <Button mt={2} colorScheme="red" onClick={deleteSelectedEdges} isDisabled={selectedEdges.size === 0}>
          Delete Selected Connections
        </Button>
      </Box>

      {/* React Flow Graph */}
      <Box flex="1" width="100vw" height="100vh">
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    fitView
    panOnScroll
    zoomOnScroll
    zoomOnDoubleClick
    style={{ width: "100vw", height: "100vh" }} // Full screen background
  >
    <Controls />
    <Background variant="dots" gap={15} size={1} />
  </ReactFlow>
</Box>

    </Box>
  );
};

export default Roadmap;
