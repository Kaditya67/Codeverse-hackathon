import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [topics, setTopics] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('');
  const [messagesByTopic, setMessagesByTopic] = useState({});
  const [explanationsByTopic, setExplanationsByTopic] = useState({});
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get-data/');

        if (response.data && response.data.topics) {
          console.log(response.data);
          setLanguage(response.data.language);
          const topicList = Object.keys(response.data.topics);
          setTopics(topicList);

          if (topicList.length > 0) {
            setCurrentTopic(topicList[0]);
            fetchTopicDetails(topicList[0]);
          }
        } else {
          throw new Error('No topics found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const fetchTopicDetails = async (selectedTopic) => {
    if (!selectedTopic) return;

    // If already fetched, switch topic without re-fetching
    if (explanationsByTopic[selectedTopic]) {
      setCurrentTopic(selectedTopic);
      return;
    }

    setMessagesByTopic((prev) => ({
      ...prev,
      [selectedTopic]: [...(prev[selectedTopic] || []), { text: `Fetching details for ${selectedTopic}...`, sender: 'bot' }]
    }));

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/get-summary/',
        { language, topic: selectedTopic },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log(response.data);
      const apiResponse = response.data.summary;

      setExplanationsByTopic((prev) => ({
        ...prev,
        [selectedTopic]: apiResponse,
      }));

      setMessagesByTopic((prev) => ({
        ...prev,
        [selectedTopic]: [
          ...(prev[selectedTopic]?.slice(0, -1) || []),
          { text: apiResponse, sender: 'bot' },
        ],
      }));

      setCurrentTopic(selectedTopic);
    } catch (error) {
      console.error('Error fetching summary:', error.response || error.message);
      setMessagesByTopic((prev) => ({
        ...prev,
        [selectedTopic]: [
          ...(prev[selectedTopic]?.slice(0, -1) || []),
          { text: 'Sorry, I could not fetch the summary at the moment.', sender: 'bot' },
        ],
      }));
    }
  };

  const handleNextTopic = () => {
    if (currentIndex < topics.length - 1) {
      const nextTopic = topics[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      fetchTopicDetails(nextTopic);
    }
  };

  const handleMoreDetails = () => {
    if (currentTopic) {
      fetchTopicDetails(currentTopic);
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
        <h3 className="text-2xl font-bold text-gray-100">LiteCoders</h3>

        <h4 className="text-lg font-medium mt-6">Topics List</h4>
        <ul className="space-y-2 mt-4">
          {topics.map((topic, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 rounded-md ${
                topic === currentTopic ? 'bg-blue-600' : 'text-gray-400'
              }`}
              onClick={() => fetchTopicDetails(topic)}
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Learning Area */}
      <div className="flex-1 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800">Learning</h2>

        <div className="mt-6 space-y-4 flex-grow">
          <p className="text-xl font-semibold text-gray-800">Topic: {currentTopic}</p>
          <p className="text-gray-600">{explanationsByTopic[currentTopic]}</p>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex justify-between space-x-4">
          <button
            className="bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-all duration-200"
            onClick={handleMoreDetails}
          >
            More Details
          </button>

          <button
            className={`py-3 px-6 rounded-lg text-lg transition-all duration-200 ${
              currentIndex < topics.length - 1
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            onClick={handleNextTopic}
            disabled={currentIndex >= topics.length - 1}
          >
            Next Topic &gt;
          </button>
        </div>
      </div>

      {/* Chatbot Section */}
      <div className="w-96 bg-white shadow-lg p-6 flex flex-col ml-auto">
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {(messagesByTopic[currentTopic] || []).map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[75%] ${
                msg.sender === 'user' ? 'bg-green-100 self-end' : 'bg-gray-100 self-start'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchTopicDetails(userInput)}
            className="flex-1 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a topic..."
          />
          <button
            onClick={() => fetchTopicDetails(userInput)}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
