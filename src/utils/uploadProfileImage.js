import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const uploadProfileImage = async (userEmail, file) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profile_images/${userEmail}/${file.name}`);

  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

export default uploadProfileImage;
