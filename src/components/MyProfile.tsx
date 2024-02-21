import { useEffect, useRef, useState } from "react";

import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../fbase";

import styled from "styled-components";

import MyButton from "./MyButton";
import uploadProfileImage from "../utils/uploadProfileImage";
import getDefaultProfileImage from "../utils/getDefaultProfileImage";

interface Props {
  email: string;
  username: string;
  photoURL: string;
  handleChangePW: () => void;
  isSocial: boolean;
}

const MyProfile = (props: Props) => {
  const [init, setInit] = useState(false);

  const [currentUsername, setCurrentUsername] = useState(props.username);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState(props.photoURL);

  const [changed, setChanged] = useState(false);

  const auth = getAuth();

  const imageInput = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (name === "username") {
      setCurrentUsername(e.target.value);
    } else if (name === "profileImage") {
      const file = imageInput.current?.files?.[0];
      if (file) {
        setProfileImage(file);
        setChanged(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
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
      await setDoc(doc(db, "users", props.email), { currentUsername });
      if (changed && profileImage) {
        const photoURL = await uploadProfileImage(props.email, profileImage);
        await updateProfile(auth.currentUser!, {
          displayName: currentUsername,
          photoURL,
        });
      } else {
        await updateProfile(auth.currentUser!, { displayName: currentUsername });
      }
      alert("내 정보 업데이트 완료");
    }
  };

  useEffect(() => {
    if (props.email && props.username) {
      setInit(true);
    }
    if (!props.photoURL) {
      getDefaultProfileImage().then((res) => setProfileImagePreview(res));
    }
  }, []);

  return (
    <>
      <div>
        {init && (
          <div>
            <ImageInputWrapper>
              {props.isSocial ? (
                <SocialInputLabel htmlFor="profileImage">
                  <ImagePreview src={profileImagePreview} alt="" />
                </SocialInputLabel>
              ) : (
                <InputLabel htmlFor="profileImage">
                  <ImagePreview src={profileImagePreview} alt="" />
                </InputLabel>
              )}
            </ImageInputWrapper>
            {!props.isSocial && <StyledInputFile ref={imageInput} id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleInput} />}

            <InfoWrapper>
              <div>
                <InfoText>닉네임 :</InfoText>
                {props.isSocial ? <InfoText>{currentUsername}</InfoText> : <UsernameInput name="username" type="text" value={currentUsername} onChange={handleInput} />}
              </div>
              <div>
                <InfoText>이메일 :</InfoText>
                <InfoText>{props.email}</InfoText>
              </div>
              <Center>
                {!props.isSocial && (
                  <>
                    <ChangePasswordLink onClick={props.handleChangePW}>비밀번호 변경</ChangePasswordLink>
                  </>
                )}
              </Center>
            </InfoWrapper>
            <BottomWrapper>{!props.isSocial && <MyButton text={"수정 완료"} type={"positive"} onClick={handleEdit} />}</BottomWrapper>
          </div>
        )}
      </div>
    </>
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
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const UsernameInput = styled.input`
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;

  @media (max-width: 768px) {
    width: 60%;
  }
`;

const BottomWrapper = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  border: 1px solid gray;
  margin: auto;
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ImageInputWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const InputLabel = styled.label`
  cursor: pointer;
  &:hover {
    filter: brightness(70%);
  }
`;

const StyledInputFile = styled.input`
  display: none;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const ChangePasswordLink = styled.span`
  cursor: pointer;
  color: blue;
  text-decoration: underline;
`;

const SocialInputLabel = styled.label``;
