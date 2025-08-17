// src/App.jsx
import React from "react";
import ReelsPage from "./components/ReelsPage";
import "./App.css"; // optional: for global styles (tailwind + custom)

function App() {
    return (
        <div className="App w-full h-screen bg-black">
            <ReelsPage />
        </div>
    );
}

export default App;
