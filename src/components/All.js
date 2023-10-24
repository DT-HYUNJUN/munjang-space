import ReportContentList from "./ReportContentList";

const All = ({ reportList, onDelete }) => {
  return (
    <div>
      <ReportContentList reportList={reportList} onDelete={onDelete} />
    </div>
  );
};

export default All;
