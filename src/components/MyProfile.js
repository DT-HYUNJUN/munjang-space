import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MyButton from "./MyButton";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../fbase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const uploadProfileImage = async (userEmail, file) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profile_images/${userEmail}/${file.name}`);

  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

const MyProfile = ({ email, username, photoURL }) => {
  const [init, setInit] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(username);
  const [profileImage, setProfileImage] = useState(photoURL);
  const [profileImagePreview, setProfileImagePreview] = useState(photoURL);
  const auth = getAuth();
  const imageInput = useRef();
  const handleInput = (e) => {
    const name = e.target.name;
    if (name === "username") {
      setCurrentUsername(e.target.value);
    } else if (name === "profileImage") {
      const file = imageInput.current.files[0];
      setProfileImage(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleEdit = async () => {
    const q = query(collection(db, "users"), where("username", "==", currentUsername));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      alert("닉네임 중복");
    } else {
      const photoURL = await uploadProfileImage(email, profileImage);
      await setDoc(doc(db, "users", email), { currentUsername });
      await updateProfile(auth.currentUser, { displayName: currentUsername, photoURL });
      alert("내 정보 업데이트 완료");
    }
  };

  useEffect(() => {
    if (email && username && photoURL) {
      setInit(true);
    }
  }, [email, username, photoURL]);

  return (
    <div>
      {init && (
        <div>
          <ImageInputWrapper>
            <InputLabel htmlFor="profileImage">
              <ImagePreview src={profileImagePreview} alt="" />
            </InputLabel>
          </ImageInputWrapper>
          <StyledInputFile ref={imageInput} id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleInput} />
          <InfoWrapper>
            <div>
              <InfoText>닉네임 :</InfoText>
              <UsernameInput name="username" type="text" value={currentUsername} onChange={handleInput} />
            </div>
            <div>
              <InfoText>이메일 :</InfoText>
              <InfoText>{email}</InfoText>
            </div>
          </InfoWrapper>
          <BottomWrapper>
            <MyButton text={"수정 완료"} type={"positive"} onClick={handleEdit} />
          </BottomWrapper>
        </div>
      )}
    </div>
  );
};

export default MyProfile;

const InfoWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoText = styled.span`
  font-family: "KyoboHandwriting2021sjy";
  font-size: 26px;
  margin-right: 10px;
  letter-spacing: 1px;
`;

const UsernameInput = styled.input`
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #ececec;
`;

const BottomWrapper = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Status = styled.p`
  color: #4db8ff;
  font-size: 20px;
`;

const ImagePreview = styled.img`
  border: 1px solid gray;
  cursor: pointer;
  margin: auto;
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 150px;
  &:hover {
    filter: brightness(70%);
  }
`;

const ImageInputWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const InputLabel = styled.label`
  cursor: pointer;
`;

const StyledInputFile = styled.input`
  display: none;
`;
