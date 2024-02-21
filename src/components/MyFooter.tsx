import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyFooter = () => {
  return (
    <footer className="Footer">
      <div className="left">
        <div className="head">
          <img src={process.env.PUBLIC_URL + "/images/book.png"} alt="logo" />
          <span>문장의 공간</span>
        </div>
        <div className="description">
          <span>"문장의 공간"은 글을 읽고 쓰는 과정을 즐기는 모든 이들을 위한 플랫폼입니다.</span>
          <span> 함께 글을 읽고 쓰며 새로운 창조적 경험을 만나보세요.</span>
          <span>우리는 다양한 글쓰기 형식과 주제를 사랑하며, 이를 공유하고 협력하는 공동체를 형성합니다.</span>
        </div>
        <span className="copyright">
          &copy; 2023 <span className="project_title">중임무황태</span> All Rights Reserved.
        </span>
      </div>
      <div className="right">
        <span className="text">Members</span>
        <a className="content" href="https://github.com/DT-HYUNJUN" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faGithub} />
          <span className="name">박현준</span>
        </a>
        <a className="content" href="https://github.com/badajinsee" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faGithub} />
          <span className="name">한선진</span>
        </a>
      </div>
    </footer>
  );
};

export default MyFooter;
