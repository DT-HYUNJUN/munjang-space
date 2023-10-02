import { useEffect, useState } from "react";
import styled from "styled-components";
import ChangePassword from "../components/ChangePassword";
import MyProfile from "../components/MyProfile";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

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
          <ChangePassword email={email} setIsChangePW={setIsChangePW} handleChangePW={handleChangePW} />
        ) : (
          <MyProfile email={email} username={username} photoURL={photoURL} handleChangePW={handleChangePW} />
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
  border: 1px solid #ccc;
  border-radius: 15px;
  margin-top: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const EditButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const BackButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 10px;
  left: 10px;
`;
