import { useEffect, useMemo, useRef, useState } from "react";
import MyButton from "../components/MyButton";
import styled from "styled-components";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ImageResize } from "quill-image-resize-module-react";
import ReactStars from "react-stars";
import Modal from "../components/Modal";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// if (typeof Quill === "object") {
//   Quill.register("modules/ImageResize", ImageResize);
// }

const New = ({ onCreate, reportCount }) => {
  const [modal, setModal] = useState(false);
  const [book, setBook] = useState({
    title: "",
    cover: "",
    author: "",
    description: "",
    isbn13: "",
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [star, setStar] = useState(3);
  const auth = getAuth();

  const quillRef = useRef(null);

  const navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    if (name === "isPrivate") {
      setIsPrivate(e.target.checked);
    } else if (name === "title") {
      setTitle(e.target.value);
    } else if (name === "star") {
      setStar(e.target.value);
    }
  };

  const handleBook = () => {
    setModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: reportCount,
      title,
      content,
      date: new Date().getTime(),
      isPrivate,
      like: 0,
      author: auth.currentUser.email,
      star,
      book,
    };
    onCreate(newItem);
    alert("작성 완료");
    navigate(`/report/${reportCount}`, { replace: true });
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.addEventListener("change", async () => {
      const editor = quillRef.current.getEditor();
      const file = input.files[0];
      const range = editor.getSelection(true);
      try {
        const storage = getStorage();
        // 파일명을 "image/Date.now()"로 저장
        const storageRef = ref(storage, `image/${Date.now()}`);
        // Firebase Method : uploadBytes, getDownloadURL
        await uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            // 이미지 URL 에디터에 삽입
            editor.insertEmbed(range.index, "image", url);
            // URL 삽입 후 커서를 이미지 뒷 칸으로 이동
            // const img = `<img src="${url}" style="max-width: 100%;" />`;
            // editor.clipboard.dangerouslyPasteHTML(range.index, img);
            editor.setSelection(range.index + 1);
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, "link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
        // imageResize: {
        //   // https://www.npmjs.com/package/quill-image-resize-module-react 참고
        //   parchment: Quill.import("parchment"),
        //   modules: ["Resize", "DisplaySize", "Toolbar"],
        // },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    };
  }, []);

  return (
    <div>
      <FormContainer onSubmit={handleSubmit}>
        <HeaderWrapper>
          <BookWrapper>
            <BookImage src={process.env.PUBLIC_URL + "/images/book.png"} alt="" />
            <BookInfoSpan>
              {book.title ? (
                <>
                  <Book onClick={handleBook}>{book.title}</Book>에 관련된 독후감입니다.
                </>
              ) : (
                <Book onClick={handleBook}>책을 선택해주세요</Book>
              )}
            </BookInfoSpan>
          </BookWrapper>
          <StarWrapper>
            <ReactStars count={5} value={star} size={26} half={false} onChange={setStar} />
          </StarWrapper>
        </HeaderWrapper>
        <HeaderWrapper>
          <TitleInput name="title" type="text" value={title} onChange={handleInput} placeholder="독후감 제목" />
          <LabelWrapper htmlFor="isPrivate">
            <PrivateLabel id="isPrivate" type="checkbox" name="isPrivate" checked={isPrivate} onChange={handleInput} />
            <PrivateSpan>비공개</PrivateSpan>
          </LabelWrapper>
        </HeaderWrapper>
        <EditorWrapper>
          <ReactQuill ref={quillRef} style={{ height: "800px", width: "1000px" }} modules={modules} theme="snow" onChange={setContent} value={content} />
        </EditorWrapper>
        <ButtonWrapper>
          <MyButton text="저장" type="positive" />
        </ButtonWrapper>
      </FormContainer>
      {modal && <Modal setModal={setModal} setBook={setBook} />}
    </div>
  );
};

export default New;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-left: 100px;
  margin-right: 100px;
  gap: 20px;
  margin-bottom: 30px;
`;

const BookImage = styled.img`
  height: 34px;
  padding: 4px;
  padding-left: 8px;
`;

const BookInfoSpan = styled.span`
  color: #0b4b77;
  font-family: "UhBeeJJIBBABBA";
`;

const Book = styled.span`
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  font-family: "UhBeeJJIBBABBA";
`;

const BookWrapper = styled.div`
  background-color: #ececec;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const EditorWrapper = styled.div`
  width: 1000px;
  height: 850px;
`;

const TitleInput = styled.input`
  /* border: 1px solid #ccc; */
  border: 0;
  border-radius: 5px;
  background-color: #ececec;
  width: 50%;
  height: 38px;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 22px;
  flex-grow: 1;
  padding-left: 8px;
`;

const LabelWrapper = styled.label`
  display: flex;
  align-items: center;
  user-select: none;
  background-color: #ececec;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  height: 42px;
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
`;

const PrivateLabel = styled.input`
  appearance: none;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #a7d7e8;
  }
`;

const PrivateSpan = styled.span`
  margin-left: 0.25rem;
  font-family: "UhBeeJJIBBABBA";
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 42px;
`;

const StarWrapper = styled.div`
  background-color: #ececec;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  padding-bottom: 7px;
  padding-left: 3px;
  padding-right: 3px;
`;
