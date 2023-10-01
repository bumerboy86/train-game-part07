import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Train } from "./components/Train/Train.tsx";
import { Passenger } from "./components/Passenger/Passenger.tsx";
import { ITrain } from "./interfaces/ITrain.ts";
import { MouseController } from "./components/MouseController/MouseController.tsx";

function App() {
  const BOARD_LENGTH = 10;
  const [direction, setDirection] = useState("right");
  const [train, setTrain] = useState<ITrain[]>([
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ]);

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const generatePassenger = () => {
    const x = Math.floor(Math.random() * BOARD_LENGTH);
    const y = Math.floor(Math.random() * BOARD_LENGTH);
    return { x, y };
  };
  const [gameOver, setGameOver] = useState(false);
  const [passenger, setPassenger] = useState(generatePassenger());
  const [isGame, setIsGame] = useState(false);

  const startGameHandler = () => {
    setLevel(1);
    setScore(0);
    setDirection("right");
    setGameOver(false);
    setTrain([
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ]);
    setPassenger(generatePassenger());
    setIsGame(true);
  };

  const isTrainCheck = (element: ITrain, index: number) => {
    const x = index % BOARD_LENGTH;
    const y = Math.floor(index / BOARD_LENGTH);
    return element.x === x && element.y === y;
  };

  const pressKeyHandler = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          if (direction !== "left") {
            setDirection("right");
          }
          break;
        case "ArrowLeft":
          if (direction !== "right") {
            setDirection("left");
          }
          break;
        case "ArrowUp":
          if (direction !== "down") {
            setDirection("up");
          }
          break;
        case "ArrowDown":
          if (direction !== "up") {
            setDirection("down");
          }
          break;
        default:
          break;
      }
    },
    [direction]
  );

  const trainMoveHandler = useCallback(() => {
    const newTrain = [...train];
    const trainHead = { ...newTrain[0] };

    switch (direction) {
      case "right":
        trainHead.x + 1 > 9 ? (trainHead.x = 0) : (trainHead.x += 1);
        break;
      case "left":
        trainHead.x - 1 < 0 ? (trainHead.x = 9) : (trainHead.x -= 1);
        break;
      case "up":
        trainHead.y - 1 < 0 ? (trainHead.y = 9) : (trainHead.y -= 1);
        break;
      case "down":
        trainHead.y + 1 > 9 ? (trainHead.y = 0) : (trainHead.y += 1);
        break;
      default:
        break;
    }
    newTrain.unshift(trainHead);
    if (newTrain.length > 1) {
      newTrain.pop();
    }
    setTrain(newTrain);
  }, [train, direction]);

  useEffect(() => {
    const moveInterval = setInterval(trainMoveHandler, 700 - level * 50);
    return () => {
      clearInterval(moveInterval);
    };
  }, [trainMoveHandler, level]);

  useEffect(() => {
    document.addEventListener("keydown", pressKeyHandler);
    return () => {
      document.removeEventListener("keydown", pressKeyHandler);
    };
  }, [pressKeyHandler]);

  useEffect(() => {
    if (train[0].x === passenger.x && train[0].y === passenger.y) {
      setPassenger(generatePassenger());
      setScore((prev) => (prev += 10));
      if (train.length % 4 === 0) {
        if (level < 13) {
          setLevel((prev) => (prev += 1));
          setDirection("right");
          setTrain([
            { x: 1, y: 0 },
            { x: 0, y: 0 },
          ]);
        } else {
          const newTrain = [...train];
          const tail = { ...newTrain[newTrain.length - 1] };
          newTrain.push(tail);
          setTrain(newTrain);
        }
      } else {
        const newTrain = [...train];
        const tail = { ...newTrain[newTrain.length - 1] };
        newTrain.push(tail);
        setTrain(newTrain);
      }
    }
    for (let i = 1; i < train.length; i++) {
      if (train[0].x === train[i].x && train[0].y === train[i].y) {
        setGameOver(true);
        if (score > totalScore) {
          localStorage.setItem("totalScore", JSON.stringify(score));
          setTotalScore(score);
        }
      }
    }
  }, [passenger, train, score, level, totalScore]);

  useEffect(() => {
    const newTotalScore = localStorage.getItem("totalScore");
    if (!newTotalScore) {
      localStorage.setItem("totalScore", JSON.stringify(0));
    } else {
      setTotalScore(Number(newTotalScore));
    }
  }, [totalScore]);

  return (
    <>
      <div className='game'>
        <h1>Train game</h1>
        <section>
          <p>Level: {level}</p>
          <p>Score: {score}</p>
        </section>
        {!isGame ? (
          <div className='startBoard'>
            <p>Press start to Play</p>
            <button onClick={startGameHandler}>START</button>
            <p>Total Score: {totalScore}</p>
          </div>
        ) : (
          <div className='gameBoard'>
            {!gameOver ? (
              <Passenger x={passenger.x} y={passenger.y} />
            ) : (
              <div className='gameOverBoard'>
                <h2>Game Over</h2>
                <p>Press start to Play</p>
                <button onClick={startGameHandler}>START</button>
                <p>Total Score: {totalScore}</p>
              </div>
            )}
            {Array.from({ length: BOARD_LENGTH * BOARD_LENGTH }, (_, i) => (
              <div className='item' key={i}>
                {!gameOver &&
                  train.some((element) => isTrainCheck(element, i)) && (
                    <Train isHead={isTrainCheck(train[0], i)} dir={direction} />
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      <MouseController dir={direction} setDir={setDirection} />
    </>
  );
}

export default App;
