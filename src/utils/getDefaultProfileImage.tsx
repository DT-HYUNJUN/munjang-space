import { getDownloadURL, getStorage, ref } from "firebase/storage";

const getDefaultProfileImage = async () => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `profile_images/default/profile.jpeg`);
    const defaultURL = await getDownloadURL(storageRef);
    return defaultURL;
  } catch (error) {
    console.log("getDefaultProfileImage Error", error);
    throw error;
  }
};

export default getDefaultProfileImage;
