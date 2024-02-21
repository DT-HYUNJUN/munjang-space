import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fbase";

const getLikeReports = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const reportsCollectionRef = collection(db, "reports");
      let allReports = [];

      const snapshot = await getDocs(reportsCollectionRef);

      for (let change of snapshot.docs) {
        const doc = change;
        const booksCollectionRef = collection(doc.ref, "books");
        const q = query(booksCollectionRef, where("like", ">", 0), where("isPrivate", "==", false));
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
