import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you with the topic?', sender: 'bot' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en'); // Assuming default language is English

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get-data/');

        // Assuming the response contains a data object with topics
        if (response.data && response.data.topics) {
          console.log(response.data); // Log the response to check the structure
          setLanguage(response.data.language); // Assuming language is part of the response
          setTopics(Object.keys(response.data.topics)); // Setting the topic keys into the state
        } else {
          throw new Error('No topics found');
        }
      } catch (error) {
        setError(error.message); // Set error message if API fails
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };

    fetchData(); // Call the function to fetch data on component mount
  }, []);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const newMessage = { text: userInput, sender: 'user' };
      setMessages([...messages, newMessage, { text: 'Let me think...', sender: 'bot' }]);
      setUserInput('');

      setTopic(userInput);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/get-summary/', {
          language: language,
          topic: userInput
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log(response.data); // Check what you are receiving from the backend
        const apiResponse = response.data.summary;
        setExplanation(apiResponse);

        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { text: apiResponse, sender: 'bot' },
        ]);
      } catch (error) {
        console.error('Error fetching summary:', error.response || error.message); // Display the actual error
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { text: 'Sorry, I could not fetch the summary at the moment.', sender: 'bot' },
        ]);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800">Learning</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800">Learning</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        {/* Bot Name */}
        <div className="flex items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-100">LiteCoders</h3>
        </div>

        {/* Past Topics Section */}
        <h4 className="text-lg font-medium mb-4">Past Topics</h4>
        <ul className="space-y-4">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <li key={index} className="text-gray-400">
                {topic}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No topics yet</li>
          )}
        </ul>
      </div>

      {/* Middle Learning Area */}
      <div className="flex-1 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800">Learning</h2>

        <div className="mt-6 space-y-4 flex-grow">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <p key={index} className="bg-gray-200 p-4 rounded-lg">
                Topic {index + 1}: {topic}
              </p>
            ))
          ) : (
            <p>No topics found</p>
          )}
        </div>

        {/* Buttons at the end of the page */}
        <div className="mt-auto flex justify-between space-x-4">
          <button className="bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-all duration-200">
            More Details
          </button>
          <button className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-green-600 transition-all duration-200">
            Next Topic &gt;
          </button>
        </div>
      </div>

      {/* Chatbot Section */}
      <div className="w-96 bg-white shadow-lg p-6 flex flex-col ml-auto">
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[75%] ${
                msg.sender === 'user'
                  ? 'bg-green-100 self-end'
                  : 'bg-gray-100 self-start'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a topic..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>

        {/* Dynamic Topic and Explanation */}
        <div className="mt-4">
          {topic && <p className="text-xl font-semibold text-gray-800">Topic: {topic}</p>}
          {explanation && <p className="mt-2 text-gray-600">{explanation}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
