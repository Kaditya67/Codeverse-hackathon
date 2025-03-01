const roadmapData = {
    topics: [
      { id: "1", title: "Internet", subtopics: ["How does the internet work?", "What is HTTP?", "DNS and how it works?"] },
      { id: "2", title: "Pick a Language", subtopics: ["JavaScript", "Python", "Go", "Rust"] },
      { id: "3", title: "Version Control", subtopics: ["Git", "GitHub", "GitLab"] }
    ],
    connections: [
      { from: "1", to: "2" },
      { from: "2", to: "3" }
    ]
  };
  
  export default roadmapData;
  