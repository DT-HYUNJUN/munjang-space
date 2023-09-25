const All = ({ reportList }) => {
  return (
    <div>
      {reportList.map((item) => (
        <div key={item.id}>
          <p>bookname: {item.bookname}</p>
          <p>title: {item.title}</p>
          <p>content: {item.content}</p>
          <p>date: {item.date}</p>
          <p>private: {item.private ? "참" : "거짓"}</p>
          <span>--</span>
        </div>
      ))}
    </div>
  );
};

export default All;
