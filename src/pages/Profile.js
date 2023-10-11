import { useEffect, useState } from "react";
import styled from "styled-components";
import ChangePassword from "../components/ChangePassword";
import MyProfile from "../components/MyProfile";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [init, setInit] = useState(false);
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isChangePW, setIsChangePW] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        setUsername(user.displayName);
        setPhotoURL(user.photoURL);
        setInit(true);
      }
    });
  }, []);

  const handleChangePW = () => setIsChangePW((prev) => !prev);

  return (
    init && (
      <Container>
        {isChangePW ? (
          <ChangePassword
            email={email}
            setIsChangePW={setIsChangePW}
            handleChangePW={handleChangePW}
          />
        ) : (
          <MyProfile
            email={email}
            username={username}
            photoURL={photoURL}
            handleChangePW={handleChangePW}
          />
        )}
      </Container>
    )
  );
};

export default Profile;

const Container = styled.div`
  position: relative;
  padding: 40px;
  margin-right: auto;
  margin-left: auto;
  width: 400px;
  height: 600px;
  /* border: 1px solid #ccc; */
  border-radius: 15px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  flex-direction: column;
  // box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: #ececec;
`;
