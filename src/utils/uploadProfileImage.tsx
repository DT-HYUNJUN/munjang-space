import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const uploadProfileImage = async (userEmail: string, file: any) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profile_images/${userEmail}/${file.name}`);
  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.log("uploadProfileImage Error", error);
  }
};

export default uploadProfileImage;
