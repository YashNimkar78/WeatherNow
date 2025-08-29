import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";   // <-- App imported here
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />   {/* App runs, which runs WeatherApp */}
  </React.StrictMode>
);
