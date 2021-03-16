import React from "react";
import Square from "./Square";
import { ColumnProps } from "../types";

class Column extends React.Component<ColumnProps> {
  render() {
    const column: Array<JSX.Element> = [];
    let squareKey: string = "";

    for (let i = 0; i < this.props.size; i++) {
      squareKey = `r${i}-${this.props.columnKey}`;
      column.push(
        <Square
          key={squareKey}
          squareKey={squareKey}
          modes={this.props.modes}
          animations={this.props.animations}
          squareData={this.props.squares[squareKey]}
          onSquareClick={this.props.onSquareClick}
          toggleScroll={this.props.toggleScroll}
          explode={this.props.explode}
          gameState={this.props.gameState}
          explosion={this.props.squares[squareKey].explosion}
        />
      );
    }
    return <div className="board-column">{column}</div>;
  }
}

export default Column;
