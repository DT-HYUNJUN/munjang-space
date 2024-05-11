import { IReport } from "../../types";
import ReportContentList from "./ReportContentList";

interface Props {
  reportList: IReport[];
  onDelete: (id: string) => void;
}

const All = (props: Props) => {
  return (
    <div>
      <ReportContentList reportList={props.reportList} onDelete={props.onDelete} />
    </div>
  );
};

export default All;
