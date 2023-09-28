import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../components/MyButton";
import styled from "styled-components";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../fbase";

const uploadProfileImage = async (userEmail, file) => {
  const storage = getStorage();
  const storageRef = ref(storage, `profile_images/${userEmail}/${file.name}`);

  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

const getDefaultProfileImage = async () => {
  const storage = getStorage();
  const storageRef = ref(storage, `profile_images/default/profile.jpeg`);
  const defaultURL = await getDownloadURL(storageRef);

  return defaultURL;
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [username, setUsername] = useState("");
  const [errorText, setErrorText] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    emailInput.current.focus();
    getDefaultProfileImage().then((res) => {
      setProfileImage(res);
      setProfileImagePreview(res);
    });
  }, []);

  const emailInput = useRef();
  const imageInput = useRef();

  const navigate = useNavigate();

  const handleInput = (e) => {
    const inputName = e.target.name;
    const value = e.target.value;
    if (inputName === "email") {
      setEmail(value);
    } else if (inputName === "password") {
      setPassword(value);
    } else if (inputName === "passwordCheck") {
      setPasswordCheck(value);
    } else if (inputName === "username") {
      setUsername(value);
    } else if (inputName === "profileImage") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setErrorText("닉네임 중복");
      } else if (password !== passwordCheck) {
        setErrorText("비밀번호가 다릅니다.");
      } else if (username.length > 5) {
        setErrorText("닉네임 길이 초과");
      } else {
        let data;
        const auth = getAuth();
        data = await createUserWithEmailAndPassword(auth, email, password);

        if (profileImage) {
          const photoURL = await uploadProfileImage(data.user.email, profileImage);
          await updateProfile(data.user, { displayName: username, photoURL });
        } else {
          await updateProfile(data.user, { displayName: username });
        }
        await setDoc(doc(db, "users", email), { username });
        navigate("/", { replace: true });
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  return (
    <div>
      <FormContainer onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        <Subtitle>문장의 공간과 함께 하세요.</Subtitle>
        <ImageInputWrapper>
          <InputLabel htmlFor="profileImage">
            <ImagePreview src={profileImagePreview} alt="" />
          </InputLabel>
        </ImageInputWrapper>
        <StyledInputFile ref={imageInput} id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleInput} />
        <Label htmlFor="email">이메일 *</Label>
        <StyledInput id="email" ref={emailInput} onChange={handleInput} name="email" value={email} type="email" required />
        <Label htmlFor="password">비밀번호 *</Label>
        <StyledInput id="password" onChange={handleInput} name="password" value={password} type="password" required />
        <Label htmlFor="passwordCheck">비밀번호 확인 *</Label>
        <StyledInput id="passwordCheck" onChange={handleInput} name="passwordCheck" value={passwordCheck} type="password" required />
        <Label htmlFor="username">닉네임 *</Label>
        <StyledInput id="username" onChange={handleInput} name="username" value={username} type="text" required />
        <MyButton text={"회원가입"} type={"positive"} />
        {errorText && <p>{errorText}</p>}
      </FormContainer>
      <StyledImg src={process.env.PUBLIC_URL + "images/login_1.jpeg"} alt="" />
    </div>
  );
};

export default SignUp;

const StyledInput = styled.input`
  font-size: 22px;
  border: 0px;
  border-radius: 3px;
  background-color: #ececec;
  color: black;
  width: 400px;
  height: 40px;
  margin-bottom: 10px;
  padding-left: 10px;
  font-family: "KyoboHandwriting2021sjy";
`;

const FormContainer = styled.form`
  display: grid;
  justify-content: center;
`;

const Title = styled.h2`
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 5px;
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  font-size: 30px;
`;

const Subtitle = styled.p`
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 0px;
  text-align: center;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 20px;
  color: gray;
`;

const StyledImg = styled.img`
  width: 100%;
`;

const StyledInputFile = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  border: 1px solid gray;
  cursor: pointer;
  margin: auto;
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 75px;
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

const Label = styled.label`
  margin-bottom: 5px;
  font-family: "KyoboHandwriting2021sjy";
`;
