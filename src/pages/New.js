import { useEffect, useMemo, useRef, useState } from "react";
import MyButton from "../components/MyButton";
import styled from "styled-components";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ImageResize } from "quill-image-resize-module-react";
import ReactStars from "react-stars";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-left: 100px;
  margin-right: 100px;
  gap: 20px;
`;

const BookImage = styled.img`
  width: 30px;
`;

const BookInfoSpan = styled.span`
  color: #0b4b77;
`;

const Book = styled.span`
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
`;

const BookWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const EditorWrapper = styled.div`
  width: 1000px;
  height: 450px;
`;

const TitleInput = styled.input`
  border: 0px;
  border-radius: 5px;
  background-color: #ececec;
  width: 50%;
  height: 30px;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 22px;
`;

const New = ({ onCreate }) => {
  const [book, setBook] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [star, setStar] = useState(3);

  const id = useRef(0);
  const quillRef = useRef(null);

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
    setBook("해리포터");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: id.current,
      book,
      title,
      content,
      date: new Date().getTime(),
      isPrivate,
    };
    onCreate(newItem);
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
          [{ header: [1, 2, 3, false] }],
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
    };
  }, []);
  // Quill.register("modules/imageResize", ImageResize);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <ReactStars count={5} value={star} size={26} half={false} onChange={setStar} />
      <BookWrapper>
        <BookImage src={process.env.PUBLIC_URL + "/images/book.png"} alt="" />
        <BookInfoSpan>
          <Book onClick={handleBook}>해리포터</Book>에 관련된 독후감입니다.
        </BookInfoSpan>
      </BookWrapper>
      <TitleInput name="title" type="text" value={title} onChange={handleInput} />
      <div>
        <label htmlFor="isPrivate">공개 여부</label>
        <input id="isPrivate" type="checkbox" name="isPrivate" checked={isPrivate} onChange={handleInput} />
      </div>
      <EditorWrapper>
        <ReactQuill ref={quillRef} style={{ height: "400px", width: "1000px" }} modules={modules} theme="snow" onChange={setContent} value={content} />
      </EditorWrapper>
      <ButtonWrapper>
        <MyButton text="저장" type="positive" />
      </ButtonWrapper>
    </FormContainer>
  );
};

export default New;
