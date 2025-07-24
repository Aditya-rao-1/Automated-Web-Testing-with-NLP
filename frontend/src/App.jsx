import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WebTester from "./pages/WebTester";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webtester" element={<WebTester />} />
      </Routes>
    </Router>
  );
}
