import React from "react";
import "./Passenger.css";

export const Passenger: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      className='passenger'
      style={{ left: `${x * 32}px`, top: `${y * 32}px` }}
    ></div>
  );
};
