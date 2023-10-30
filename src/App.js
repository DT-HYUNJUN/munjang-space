import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Book from "./pages/Book";
import List from "./pages/List";
import BookSearch from "./pages/BookSearch";
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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getDefaultProfileImage from "./utils/getDefaultProfileImage";
import ThisBookReport from "./pages/ThisBookReport";

function App() {
  const [IsLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));
  const [userInfo, setUserInfo] = useState({});
  const [reportList, setReportList] = useState([]);
  const [reportCount, setReportCount] = useState(0);
  const auth = getAuth();

  useEffect(() => {
    let unSubscribe;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
        unSubscribe = onSnapshot(
          collection(db, "reports", user.email, "books"),
          (querySnapShot) => {
            const data = [];
            querySnapShot.forEach((doc) => {
              data.push(doc.data());
            });
            setReportList(data);
            setReportCount(data.length);
          }
        );
        if (user.photoURL) {
          setUserInfo({
            email: user.email,
            photoURL: user.photoURL,
            username: user.displayName,
          });
        } else {
          getDefaultProfileImage().then((res) =>
            setUserInfo({
              email: user.email,
              photoURL: res,
              username: user.displayName,
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
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (id, report) => {
    try {
      const editReportRef = doc(db, "reports", userInfo.email, "books", id);
      await setDoc(editReportRef, report);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (id) => {
    try {
      const deleteReportRef = doc(
        db,
        "reports",
        userInfo.email,
        "books",
        `${id}`
      );
      console.log(deleteReportRef);
      await deleteDoc(deleteReportRef);
    } catch (error) {
      console.log(error);
    }
  };

  const onLike = async (author, id) => {
    const likeListRef = collection(
      db,
      "reports",
      author,
      "books",
      `${id}`,
      "likeList"
    );
    const docRef = doc(likeListRef, userInfo.email);
    const document = await getDoc(docRef);
    if (document.data()) {
      if (document.data().isLike === true) {
        // 좋아요 리스트에 있으면 -> 좋아요 취소
        await updateDoc(docRef, { isLike: false });
      } else {
        // 좋아요 리스트에 있고, false -> 좋아요
        await updateDoc(docRef, { isLike: true });
      }
    } else {
      // 좋아요 리스트에 없으면 -> 좋아요
      const reportRef = doc(
        collection(db, "reports", author, "books", `${id}`, "likeList"),
        userInfo.email
      );
      await setDoc(reportRef, { isLike: true });
    }
    const q = query(likeListRef, where("isLike", "==", true));
    const LikeListDocs = await getDocs(q);
    const count = LikeListDocs.docs.length;
    await updateDoc(doc(db, "reports", author, "books", `${id}`), {
      like: count,
    });
  };

  return (
    <BrowserRouter>
      <MyHeader IsLogin={IsLogin} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/book/:isbn13" element={<Book IsLogin={IsLogin} />} />
          <Route path="/thisbookreport/:isbn13" element={<ThisBookReport />} />
          <Route
            path="/list"
            element={
              <List
                reportList={reportList}
                onDelete={onDelete}
                IsLogin={IsLogin}
              />
            }
          />
          <Route path="/booksearch" element={<BookSearch />} />

          <Route
            path="/report/:email/:id"
            element={
              <Report
                reportList={reportList}
                onLike={onLike}
                onDelete={onDelete}
                userInfo={userInfo}
              />
            }
          />
          <Route
            path="/new"
            element={
              <New
                onCreate={onCreate}
                reportCount={reportCount}
                userInfo={userInfo}
                IsLogin={IsLogin}
              />
            }
          />
          <Route path="/edit/:id" element={<Edit onEdit={onEdit} />} />

          <Route
            path="/statistics"
            element={<Statistics IsLogin={IsLogin} reportList={reportList} />}
          />
        </Routes>
      </div>
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
