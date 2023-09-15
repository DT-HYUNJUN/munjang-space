import MyButton from "../components/MyButton";

const Home = () => {
  return (
    <div>
      <MyButton text={"버튼"} onClick={() => alert("버튼")} />
      <MyButton text={"저장"} type={"positive"} />
      <MyButton text={"삭제"} type={"negative"} />
    </div>
  );
};

export default Home;
