import { FC } from "react";
import "./MouseController.css";

type TMouseControllerProps = {
  setDir: (data: string) => void;
  dir: string;
};

export const MouseController: FC<TMouseControllerProps> = ({ dir, setDir }) => {
  const setDirectionHandler = (data: string) => {
    switch (data) {
      case "ArrowRight":
        if (dir !== "left") {
          setDir("right");
        }
        break;
      case "ArrowLeft":
        if (dir !== "right") {
          setDir("left");
        }
        break;
      case "ArrowUp":
        if (dir !== "down") {
          setDir("up");
        }
        break;
      case "ArrowDown":
        if (dir !== "up") {
          setDir("down");
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className='controller'>
      <div>
        <button onClick={() => setDirectionHandler("ArrowLeft")}>left</button>
        <button onClick={() => setDirectionHandler("ArrowRight")}>right</button>
      </div>
      <div>
        <button onClick={() => setDirectionHandler("ArrowUp")}>up</button>
        <button onClick={() => setDirectionHandler("ArrowDown")}>down</button>
      </div>
    </div>
  );
};
