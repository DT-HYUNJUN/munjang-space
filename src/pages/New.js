import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MyButton from "../components/MyButton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, "link"],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
        { background: [] },
      ],
      ["image", "video"],
      ["clean"],
    ],
  },
};

const New = ({ onCreate }) => {
  const [book, setBook] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const id = useRef(0);

  const handleInput = (e) => {
    const name = e.target.name;
    if (name === "isPrivate") {
      setIsPrivate(e.target.checked);
    } else if (name === "title") {
      setTitle(e.target.value);
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

  return (
    <FormContainer onSubmit={handleSubmit}>
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
        <ReactQuill style={{ height: "400px", width: "1000px" }} modules={modules} theme="snow" onChange={setContent} value={content} />
      </EditorWrapper>
      <ButtonWrapper>
        <MyButton text="저장" type="positive" />
      </ButtonWrapper>
    </FormContainer>
  );
};

export default New;
