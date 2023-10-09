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
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "./fbase";
import { getAuth } from "firebase/auth";

const dummyData = [
  {
    id: 0,
    bookname: "해리포터",
    title: "0",
    content: "0",
    date: 1695463111141,
    private: false,
    star: 1,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 1,
    bookname: "해리포터1",
    title: "1",
    content: "1",
    date: 1695463111142,
    private: false,
    star: 2,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 2,
    bookname: "해리포터2",
    title: "2",
    content: "2",
    date: 1695463111143,
    private: false,
    star: 3,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 3,
    bookname: "해리포터3",
    title: "3",
    content: "3",
    date: 1695463111144,
    private: false,
    star: 4,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 4,
    bookname: "해리포터4",
    title: "4",
    content: "4",
    date: 1695463111145,
    private: true,
    star: 5,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 5,
    bookname: "해리포터5",
    title: "5",
    content: "5",
    date: 1695463111146,
    private: true,
    star: 5,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 6,
    bookname: "해리포터6",
    title: "6",
    content: "6",
    date: 1695463111147,
    private: true,
    star: 1,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 7,
    bookname: "해리포터7",
    title: "7",
    content: "7",
    date: 1695463111148,
    private: false,
    star: 2,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 8,
    bookname: "해리포터8",
    title: "8",
    content: "8",
    date: 1695463111149,
    private: true,
    star: 3,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 9,
    bookname: "해리포터9",
    title: "9",
    content: "9",
    date: 1695463111150,
    private: false,
    star: 4,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 10,
    bookname: "해리포터10",
    title: "10",
    content: "10",
    date: 1695463111151,
    private: true,
    star: 5,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 11,
    bookname: "해리포터11",
    title: "11",
    content: "11",
    date: 1695463111152,
    private: false,
    star: 1,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 12,
    bookname: "해리포터12",
    title: "12",
    content: "12",
    date: 1695463111153,
    private: true,
    star: 2,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 13,
    bookname: "해리포터13",
    title: "13",
    content: "13",
    date: 1695463111154,
    private: false,
    star: 3,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 14,
    bookname: "해리포터14",
    title: "14",
    content: "14",
    date: 1695463111155,
    private: true,
    star: 4,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
  {
    id: 15,
    bookname: "해리포터15",
    title: "15",
    content: "15",
    date: 1695463111156,
    private: false,
    star: 5,
    imageUrl: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
  },
];

function App() {
  const [reportList, setReportList] = useState(dummyData);
  const auth = getAuth();

  const onCreate = async (report) => {
    try {
      const docRef = doc(
        collection(db, "reports", report.author, report.book),
        `${report.id}`
      );
      await setDoc(docRef, report);
      alert("작성 완료");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // const data = onSnapshot(
    //   doc(db, "reports", auth.currentUser.email),
    //   (doc) => {
    //     console.log(doc.data());
    //   }
    // );
  }, []);

  return (
    <BrowserRouter>
      <MyHeader />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/book/:isbn13" element={<Book />} />
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
