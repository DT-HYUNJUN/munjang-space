import "./App.css";
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
import { useEffect, useReducer, useState } from "react";

const dummyData = [
  {
    id: 0,
    bookname: "해리포터",
    title: "0",
    content: "0",
    date: 1695463111141,
    private: false,
    star: 1,
  },
  {
    id: 1,
    bookname: "해리포터1",
    title: "1",
    content: "1",
    date: 1695463111142,
    private: false,
    star: 2,
  },
  {
    id: 2,
    bookname: "해리포터2",
    title: "2",
    content: "2",
    date: 1695463111143,
    private: false,
    star: 3,
  },
  {
    id: 3,
    bookname: "해리포터3",
    title: "3",
    content: "3",
    date: 1695463111144,
    private: false,
    star: 4,
  },
  {
    id: 4,
    bookname: "해리포터4",
    title: "4",
    content: "4",
    date: 1695463111145,
    private: true,
    star: 5,
  },
  {
    id: 5,
    bookname: "해리포터5",
    title: "5",
    content: "5",
    date: 1695463111146,
    private: true,
    star: 5,
  },
  {
    id: 6,
    bookname: "해리포터6",
    title: "6",
    content: "6",
    date: 1695463111147,
    private: true,
    star: 1,
  },
];

function App() {
  const [reportList, setReportList] = useState(dummyData);

  const onCreate = (report) => {
    setReportList([report, ...reportList]);
  };

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
          <Route path="/list" element={<List reportList={reportList} />} />
          <Route path="/report" element={<Report />} />
          <Route path="/new" element={<New onCreate={onCreate} />} />
          <Route path="/edit" element={<Edit />} />

          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
