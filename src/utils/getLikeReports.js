import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../fbase";

const getLikeReports = () => {
  // return new Promise(async (resolve, reject) => {
  //   const reportsCollectionRef = collection(db, "reports");
  //   let allReports = [];

  //   onSnapshot(reportsCollectionRef, async (snapshot) => {
  //     const promises = snapshot.docChanges().map(async (change) => {
  //       if (change.type === "added" || change.type === "modified") {
  //         const doc = change.doc;
  //         const booksCollectionRef = collection(doc.ref, "books");
  //         const booksQuerySnapshot = await getDocs(booksCollectionRef);

  //         booksQuerySnapshot.forEach((bookData) => {
  //           allReports.push(bookData.data());
  //         });
  //       }
  //     });

  //     await Promise.all(promises);
  //     resolve(allReports);
  //   });
  // });

  return new Promise(async (resolve, reject) => {
    try {
      const reportsCollectionRef = collection(db, "reports");
      let allReports = [];

      const snapshot = await getDocs(reportsCollectionRef);

      for (let change of snapshot.docs) {
        const doc = change;
        const booksCollectionRef = collection(doc.ref, "books");
        const q = query(booksCollectionRef, where("like", ">", 0));
        const booksQuerySnapshot = await getDocs(q);

        for (let bookData of booksQuerySnapshot.docs) {
          allReports.push(bookData.data());
        }
      }
      resolve(allReports);
    } catch (error) {
      reject(error);
    }
  });
};

export default getLikeReports;
