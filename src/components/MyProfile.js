import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import styled from "styled-components";
import MyButton from "./MyButton";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../fbase";

const MyProfile = ({ email, username, photoURL }) => {
  const [init, setInit] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(username);
  const [status, setStatus] = useState("asdads");
  const auth = getAuth();
  const handleInput = (e) => {
    setCurrentUsername(e.target.value);
  };

  const handleEdit = async () => {
    const q = query(collection(db, "users"), where("username", "==", currentUsername));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setStatus("닉네임 중복");
    } else {
      await updateProfile(auth.currentUser, { displayName: currentUsername });
      setStatus("닉네임 업데이트");
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
          <ImageWrapper>{photoURL && <ProfileImage src={photoURL} alt="profile" />}</ImageWrapper>
          <InfoWrapper>
            <div>
              <InfoText>닉네임 :</InfoText>
              <InfoText>이메일 :</InfoText>
            </div>
            <div>
              <UsernameInput type="text" value={currentUsername} onChange={handleInput} />
              <InfoText>{email}</InfoText>
            </div>
          </InfoWrapper>
          <BottomWrapper>
            <MyButton text={"수정 완료"} type={"positive"} onClick={handleEdit} />
            <Status>{status}</Status>
          </BottomWrapper>
        </div>
      )}
    </div>
  );
};

export default MyProfile;

const ProfileImage = styled.img`
  border: 1px solid #ccc;
  width: 200px;
  height: 200px;
  border-radius: 150px;
`;

const InfoWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 10px;
`;

const InfoText = styled.p`
  font-family: "KyoboHandwriting2021sjy";
  font-size: 26px;
  letter-spacing: 1px;
`;

const ImageWrapper = styled.div`
  text-align: center;
`;

const UsernameInput = styled.input`
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #ececec;
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Status = styled.p`
  color: #4db8ff;
  font-size: 20px;
`;
