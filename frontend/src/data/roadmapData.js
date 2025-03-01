const roadmapData = {
  topics: [
    { id: "1", label: "Internet", subtopics: ["How does the internet work?", "What is HTTP?", "DNS and how it works?"] },
    { id: "2", label: "Programming Language", subtopics: ["JavaScript", "Python", "Go", "Rust"] },
    { id: "3", label: "Version Control", subtopics: ["Git", "GitHub", "GitLab"] }
  ],
  connections: [
    { from: "1", to: "2" }, // Connect Internet → Programming Language
    { from: "2", to: "3" }  // Connect Programming Language → Version Control
  ]
};

export default roadmapData;
