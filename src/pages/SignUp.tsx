import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadProfileImage from "../utils/uploadProfileImage";
import getDefaultProfileImage from "../utils/getDefaultProfileImage";
import MyButton from "../components/Global/MyButton";
import styled from "styled-components";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FirebaseError } from "firebase/app";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | File>("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [defaultImage, setDefaultImage] = useState(true);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordErrorCheck, setPasswordErrorCheck] = useState("");

  const [loading, setLoading] = useState(false);

  const emailInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInput.current!.focus();
    getDefaultProfileImage().then((res) => {
      if (res) {
        setProfileImage(res);
        setProfileImagePreview(res);
      }
    });
  }, []);

  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (imageInput.current && imageInput.current.files) {
        const file = imageInput.current.files[0];
        setProfileImage(file as any);
        setDefaultImage(false);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageDataUrl = reader.result as string;
            setProfileImagePreview(imageDataUrl);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(false);
    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error("username-already-in-use");
      }
      if (password !== passwordCheck) {
        throw new Error("password-incorrect");
      }
      if (username.length > 6) {
        throw new Error("username-length");
      } else {
        setLoading(true);
        let data;
        const auth = getAuth();
        data = await createUserWithEmailAndPassword(auth, email, password);

        if (defaultImage) {
          await updateProfile(data.user, { displayName: username });
        } else {
          const photoURL = await uploadProfileImage(data.user.email!, profileImage);
          await updateProfile(data.user, { displayName: username, photoURL });
        }
        await setDoc(doc(db, "users", email), { username });
        await setDoc(doc(db, "reports", email), { username });
        alert("회원가입 완료");
        navigate("/", { replace: true });
        window.location.reload();
      }
    } catch (error) {
      if ((error as FirebaseError).code === "auth/email-already-in-use") {
        setEmailError("이미 사용 중인 이메일입니다.");
      }
      if ((error as FirebaseError).code === "auth/weak-password") {
        setPasswordError("");
      }
      if ((error as FirebaseError).message === "username-already-in-use") {
        setUsernameError("이미 사용 중인 닉네임입니다.");
      }
      if ((error as FirebaseError).message === "password-incorrect") {
        setPasswordErrorCheck("비밀번호가 일치하지 않습니다.");
      }
      if ((error as FirebaseError).message === "username-length") {
        setUsernameError("닉네임은 6자까지 설정할 수 있습니다.");
      }
    } finally {
      localStorage.setItem("isSocial", JSON.stringify(false));
      setLoading(false);
    }
  };

  return loading ? (
    <Loading>
      <FontAwesomeIcon icon={faSpinner} spin size="4x" />
    </Loading>
  ) : (
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
        <Label htmlFor="email">
          이메일 *<ErrorText>{emailError}</ErrorText>
        </Label>
        <StyledInput id="email" ref={emailInput} onChange={handleInput} name="email" value={email} type="email" required placeholder="Email" />
        <Label htmlFor="password">
          비밀번호 *<ErrorText>{passwordError}</ErrorText>
        </Label>
        <StyledInput id="password" onChange={handleInput} name="password" value={password} type="password" required placeholder="Password (6글자 이상)" />
        <Label htmlFor="passwordCheck">
          비밀번호 확인 *<ErrorText>{passwordErrorCheck}</ErrorText>
        </Label>
        <StyledInput id="passwordCheck" onChange={handleInput} name="passwordCheck" value={passwordCheck} type="password" required placeholder="Password Check" />
        <Label htmlFor="username">
          닉네임 *<ErrorText>{usernameError}</ErrorText>
        </Label>
        <StyledInput id="username" onChange={handleInput} name="username" value={username} type="text" placeholder="Nickname (6글자)" maxLength={6} required />
        <MyButton text={"회원가입"} type={"positive"} />
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

  @media (max-width: 768px) {
    width: 300px;
  }
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

const ErrorText = styled.span`
  margin-left: 10px;
  color: red;
`;

const Loading = styled.div`
  display: flex;
  margin-top: 150px;
  justify-content: center;
  align-items: center;
`;
