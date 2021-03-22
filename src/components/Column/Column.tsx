import React from "react";
import Square from "../Square/Square";
import { ColumnProps } from "../../types";

const Column = ({
  columnKey,
  size,
  squares,
  modes,
  animations,
  onSquareClick,
  toggleScroll,
  explode,
  gameState,
}: ColumnProps): JSX.Element => {
  const createArray = (
    columnArray: JSX.Element[],
    count: number,
  ): JSX.Element[] => {
    // Recursive fn to create a columnArray of Square components
    const squareKey = `r${count}-${columnKey}`;
    if (count < size && squares[squareKey]) {
      columnArray.push(
        <Square
          key={squareKey}
          squareKey={squareKey}
          modes={modes}
          animations={animations}
          squareData={squares[squareKey]}
          onSquareClick={onSquareClick}
          toggleScroll={toggleScroll}
          explode={explode}
          gameState={gameState}
        />,
      );
      createArray(columnArray, count + 1);
    }
    return columnArray;
  };
  const columnArray: JSX.Element[] = [];
  createArray(columnArray, 0);
  return <div className="board-column">{columnArray}</div>;
};

export default Column;
