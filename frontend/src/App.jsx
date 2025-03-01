import { useEffect, useState } from "react";

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api/chatbot/")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(data.message)
            });
    }, []);

    return (
        <div>
            <h1>React + Vite + Django</h1>
            <p>{data ? data : "Loading..."}</p>
        </div>
    );
}

export default App;
