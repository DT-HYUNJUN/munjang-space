import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const uploadProfileImage = async (userEmail: string, file: File) => {
  const storage = getStorage();
  console.log(file);
  const storageRef = ref(storage, `profile_images/${userEmail}/${file.name}`);

  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

export default uploadProfileImage;
