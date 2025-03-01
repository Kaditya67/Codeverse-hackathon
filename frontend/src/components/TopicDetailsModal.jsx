import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text } from "@chakra-ui/react";

const TopicDetailsModal = ({ topic, onClose }) => {
  return (
    <Modal isOpen={!!topic} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{topic?.label}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {topic?.subtopics && topic.subtopics.map((subtopic, index) => (
            <Text key={index}>• {subtopic}</Text>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TopicDetailsModal;
