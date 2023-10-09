import { getDownloadURL, getStorage, ref } from "firebase/storage";

const getDefaultProfileImage = async () => {
  const storage = getStorage();
  const storageRef = ref(storage, `profile_images/default/profile.jpeg`);
  const defaultURL = await getDownloadURL(storageRef);

  return defaultURL;
};

export default getDefaultProfileImage;
