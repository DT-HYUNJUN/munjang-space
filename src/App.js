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
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getDefaultProfileImage from "./utils/getDefaultProfileImage";

function App() {
  const [IsLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));
  const [userInfo, setUserInfo] = useState({});
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
        unSubscribe = onSnapshot(collection(db, "reports", user.email, "books"), (querySnapShot) => {
          const data = [];
          querySnapShot.forEach((doc) => {
            data.push(doc.data());
          });
          setTestData(data);
          setReportCount(data.length);
        });
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
      const docRef = doc(collection(db, "reports", report.author, "books"), `${report.id}`);
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
      const deleteReportRef = doc(db, "reports", userInfo.email, "books", `${id}`);
      console.log(deleteReportRef);
      await deleteDoc(deleteReportRef);
    } catch (error) {
      console.log(error);
    }
  };

  const onLike = async (author, id) => {
    const likeListRef = collection(db, "reports", author, "books", `${id}`, "likeList");
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
      const reportRef = doc(collection(db, "reports", author, "books", `${id}`, "likeList"), userInfo.email);
      await setDoc(reportRef, { isLike: true });
    }
    const q = query(likeListRef, where("isLike", "==", true));
    const LikeListDocs = await getDocs(q);
    const count = LikeListDocs.docs.length;
    await updateDoc(doc(db, "reports", author, "books", `${id}`), {
      like: count,
    });
  };

  const getBookReports = (isbn13) => {
    const reportsCollectionRef = collection(db, "reports");
    const allReports = [];

    // 각 사용자 문서에서 'books' 컬렉션을 참조합니다.
    onSnapshot(reportsCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added" || change.type === "modified") {
          // 추가 또는 수정된 문서 처리
          const doc = change.doc;

          const booksCollectionRef = collection(doc.ref, "books");
          const q = query(booksCollectionRef, where("book.isbn13", "==", isbn13));
          const booksQuerySnapshot = await getDocs(q);

          booksQuerySnapshot.forEach((bookDoc) => {
            // 각 'books' 컬렉션의 독후감 문서를 allReports 목록에 추가합니다.
            allReports.push(bookDoc.data());
          });

          // 이제 allReports 배열은 변경된 데이터를 포함하게 됩니다.
          // console.log(allReports);
        }
      });
    });
  };

  // useEffect(() => {
  //   const isbn13 = "9791192908236";
  //   getBookReports(isbn13);
  // }, []);

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
          <Route path="/list" element={<List reportList={testData} onDelete={onDelete} />} />

          <Route path="/report/:id" element={<Report reportList={testData} onLike={onLike} onDelete={onDelete} userInfo={userInfo} />} />
          <Route path="/new" element={<New onCreate={onCreate} reportCount={reportCount} userInfo={userInfo} />} />

          <Route path="/edit/:id" element={<Edit onEdit={onEdit} />} />

          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
