interface Props {
  text: string;
  type: string;
  onClick?: () => void;
}

const MyButton = (props: Props) => {
  const btnType = ["positive", "negative"].includes(props.type) ? props.type : "default";
  return (
    <button className={["MyButton", `MyButton_${btnType}`].join(" ")} onClick={props.onClick}>
      {props.text}
    </button>
  );
};

MyButton.defaultProps = {
  type: "default",
};

export default MyButton;
