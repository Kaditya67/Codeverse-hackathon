import React from "react";
import { 
  Box, Button, Heading, Text, VStack, Container, HStack, Icon, Flex, Divider, Link 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaEdit, FaRobot, FaBook, FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box fontFamily="'Poppins', sans-serif">
      {/* Hero Section */}
      <Box bg="blue.600" color="white" py={24} textAlign="center">
        <Container maxW="container.lg">
          <VStack spacing={6}>
            <Heading size="2xl" fontWeight="bold">AI-Powered Adaptive Learning</Heading>
            <Text fontSize="xl" maxW="700px" opacity="0.9">
              Build your own learning roadmap, interact with our AI chatbot, and 
              master concepts through personalized quizzes and explanations.
            </Text>
            <Button 
              colorScheme="yellow" 
              size="lg" 
              fontSize="xl" 
              fontWeight="bold"
              onClick={() => navigate("/flowchart")}
              _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
            >
              Start Your Journey 
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <Heading textAlign="center" mb={14} fontSize="3xl" fontWeight="bold">
          Key Features
        </Heading>
        <Flex wrap="wrap" justify="center" gap={10}>
          <FeatureCard 
            icon={FaBrain} 
            title="AI-Generated Roadmap" 
            description="Customize and refine your learning path dynamically."
          />
          <FeatureCard 
            icon={FaEdit} 
            title="Interactive Learning" 
            description="Engage with the chatbot to learn and practice concepts."
          />
          <FeatureCard 
            icon={FaRobot} 
            title="Smart Chatbot Assistance" 
            description="Get detailed explanations and side insights instantly."
          />
          <FeatureCard 
            icon={FaBook} 
            title="Integrated Notes" 
            description="Save and view your notes directly within the roadmap."
          />
        </Flex>
      </Container>

      {/* Call to Action */}
      <Box textAlign="center" py={12} bg="gray.100">
        <Heading size="lg" mb={4} fontWeight="bold">Ready to Enhance Your Learning?</Heading>
        <Button 
          colorScheme="blue" 
          size="lg" 
          fontSize="xl"
          onClick={() => navigate("/flowchart")}
          _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
        >
          Explore Now 🚀
        </Button>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <VStack 
      p={6} 
      borderRadius="lg" 
      bg="white" 
      spacing={5} 
      textAlign="center"
      maxW="280px"
      transition="all 0.3s"
      boxShadow="md"
      _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
    >
      <Box bg="blue.500" borderRadius="full" p={4} boxShadow="md">
        <Icon as={icon} boxSize={10} color="white" />
      </Box>
      <Heading size="md" fontWeight="bold">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  );
};

const Footer = () => {
  return (
    <Box bg="blue.800" color="white" py={8} textAlign="center">
      <Container maxW="container.lg">

        {/* Social Media Links */}
        <HStack justify="center" spacing={6} mb={4}>
          <Link href="https://facebook.com" isExternal>
            <Icon as={FaFacebook} boxSize={6} _hover={{ color: "yellow.300", transform: "scale(1.2)", transition: "0.3s" }} />
          </Link>
          <Link href="https://twitter.com" isExternal>
            <Icon as={FaTwitter} boxSize={6} _hover={{ color: "yellow.300", transform: "scale(1.2)", transition: "0.3s" }} />
          </Link>
          <Link href="https://linkedin.com" isExternal>
            <Icon as={FaLinkedin} boxSize={6} _hover={{ color: "yellow.300", transform: "scale(1.2)", transition: "0.3s" }} />
          </Link>
          <Link href="https://github.com" isExternal>
            <Icon as={FaGithub} boxSize={6} _hover={{ color: "yellow.300", transform: "scale(1.2)", transition: "0.3s" }} />
          </Link>
        </HStack>

        {/* Divider */}
        <Divider borderColor="gray.500" opacity="0.5" />

        {/* Copyright Info */}
        <Text fontSize="sm" opacity="0.8" mt={4}>
          © {new Date().getFullYear()} AI Learning Platform. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default LandingPage;
