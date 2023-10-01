import { ITrainProps } from "../../interfaces/ITrainProps.ts";
import "./Train.css";

const getRotationAgle = (dierection: string) => {
  switch (dierection) {
    case "right":
      return "270deg";
    case "left":
      return "90deg";
    case "up":
      return "180deg";
    case "down":
      return "0deg";
    default:
      break;
  }
};

export const Train = (data: ITrainProps) => {
  return (
    <div
      className={data.isHead ? "train-head" : "train"}
      style={{ transform: `rotate(${getRotationAgle(data.dir)})` }}
    ></div>
  );
};
