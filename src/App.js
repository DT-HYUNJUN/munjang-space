import "./App.css";
import { useEffect, useState } from "react";
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
import SignUp from "./pages/SignUp";

import MyHeader from "./components/MyHeader";
import MyFooter from "./components/MyFooter";

import { db } from "./fbase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getDefaultProfileImage from "./utils/getDefaultProfileImage";

const dummyData = [
  {
    id: 0,
    title: "0",
    content: "0",
    date: 1695463111141,
    isPrivate: false,
    star: 1,
    book: {
      title: "해리포터",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 1,
    title: "1",
    content: "1",
    date: 1695463111142,
    isPrivate: false,
    star: 2,
    book: {
      title: "해리포터1",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 2,
    title: "2",
    content: "2",
    date: 1695463111143,
    isPrivate: false,
    star: 3,
    book: {
      title: "해리포터2",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 3,
    title: "3",
    content: "3",
    date: 1695463111144,
    isPrivate: false,
    star: 4,
    book: {
      title: "해리포터3",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 4,
    title: "4",
    content: "4",
    date: 1695463111145,
    isPrivate: true,
    star: 5,
    book: {
      title: "해리포터4",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 5,
    title: "5",
    content: "5",
    date: 1695463111146,
    isPrivate: true,
    star: 5,
    book: {
      title: "해리포터5",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 6,
    title: "6",
    content: "6",
    date: 1695463111147,
    isPrivate: true,
    star: 1,
    book: {
      title: "해리포터6",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 7,
    title: "7",
    content: "7",
    date: 1695463111148,
    isPrivate: false,
    star: 2,
    book: {
      title: "해리포터7",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 8,
    title: "8",
    content: "8",
    date: 1695463111149,
    isPrivate: true,
    star: 3,
    book: {
      title: "해리포터8",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 9,
    title: "9",
    content: "9",
    date: 1695463111150,
    isPrivate: false,
    star: 4,
    book: {
      title: "해리포터9",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 10,
    title: "10",
    content: "10",
    date: 1695463111151,
    isPrivate: true,
    star: 5,
    book: {
      title: "해리포터10",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 11,
    title: "11",
    content: "11",
    date: 1695463111152,
    isPrivate: false,
    star: 1,
    book: {
      title: "해리포터11",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 12,
    title: "12",
    content: "12",
    date: 1695463111153,
    isPrivate: true,
    star: 2,
    book: {
      title: "해리포터12",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 13,
    title: "13",
    content: "13",
    date: 1695463111154,
    isPrivate: false,
    star: 3,
    book: {
      title: "해리포터13",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 14,
    author: "testUser",
    title: "14",
    content: "14",
    date: 1695463111155,
    isPrivate: true,
    star: 4,
    book: {
      title: "해리포터14",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
  {
    id: 15,
    title: "15",
    content: "15",
    date: 1695463111156,
    isPrivate: false,
    star: 5,
    book: {
      title: "해리포터15",
      cover: `${process.env.PUBLIC_URL}/images/예시책.jpeg`,
    },
  },
];

function App() {
  const [IsLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));
  const [userInfo, setUserInfo] = useState({});
  const [reportList, setReportList] = useState(dummyData);
  const [testData, setTestData] = useState([]);
  const [reportCount, setReportCount] = useState(0);
  const auth = getAuth();

  useEffect(() => {
    let unSubscribe;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        setIsLogin(true);
        // loadData(user.email);
        unSubscribe = onSnapshot(
          collection(db, "reports", user.email, "books"),
          (querySnapShot) => {
            const data = [];
            querySnapShot.forEach((doc) => {
              data.push(doc.data());
            });
            setTestData(data);
            setReportCount(data.length);
          }
        );
        if (user.photoURL) {
          setUserInfo({
            email: user.email,
            photoURL: user.photoURL,
            nickname: user.displayName,
          });
        } else {
          getDefaultProfileImage().then((res) =>
            setUserInfo({
              email: user.email,
              photoURL: res,
              nickname: user.displayName,
            })
          );
        }

        localStorage.setItem("isLogin", true);
      } else {
        setIsLogin(false);
        localStorage.setItem("isLogin", false);
      }
    });
    return () => unSubscribe();
  }, []);

  const onCreate = async (report) => {
    try {
      const docRef = doc(
        collection(db, "reports", report.author, "books"),
        `${report.id}`
      );
      await setDoc(docRef, report);
      alert("작성 완료");
    } catch (error) {
      console.log(error);
    }
  };

  // const loadData = async (author) => {
  //   try {
  //     const querySnapShot = await getDocs(collection(db, "reports", author, "books"));
  //     const reports = [];
  //     querySnapShot.forEach((doc) => {
  //       if (doc.exists()) {
  //         reports.push(doc.data());
  //       }
  //     });
  //     setTestData([...reports]);
  //   } catch (error) {}
  // };

  return (
    <BrowserRouter>
      <MyHeader IsLogin={IsLogin} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/book/:isbn13" element={<Book />} />
          <Route path="/list" element={<List reportList={testData} />} />

          <Route
            path="/report/:id"
            element={<Report reportList={testData} userInfo={userInfo} />}
          />
          <Route
            path="/new"
            element={<New onCreate={onCreate} reportCount={reportCount} />}
          />

          <Route path="/edit" element={<Edit />} />

          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
