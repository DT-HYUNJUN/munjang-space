import "./App.css";

// import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Book from "./pages/Book";
import List from "./pages/List";
import Report from "./pages/Report";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Statistics from "./pages/Statistics";

import MyHeader from "./components/MyHeader";
import MyFooter from "./components/MyFooter";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <MyHeader />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/book" element={<Book />} />
          <Route path="/list" element={<List />} />
          <Route path="/report" element={<Report />} />
          <Route path="/new" element={<New />} />
          <Route path="/edit" element={<Edit />} />

          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
