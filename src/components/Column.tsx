import React from 'react';
import Square from './Square';

interface Props {
  columnKey: string,
  animations: animationsType,
  gameState: gameStateType,
  modes: modesType,
  squares: object,
  size: number,
  explode: (squareKey: string) => void,
  onSquareClick: (squareKey: string) => void,
  toggleScroll: (bool: boolean, anim: string) => void
}

interface State {
}

class Column extends React.Component<Props, State> {
  render() {
    const column: Array<JSX.Element> = [];
    for (let i = 0; i < this.props.size; i++) {
      column.push(<Square
        key={`r${i}-${this.props.columnKey}`}
        squareKey={`r${i}-${this.props.columnKey}`}
        modes={this.props.modes}
        animations={this.props.animations}
        squareData={this.props.squares[`r${i}-${this.props.columnKey}`]}
        onSquareClick={this.props.onSquareClick}
        toggleScroll={this.props.toggleScroll}
        explode={this.props.explode}
        gameState={this.props.gameState}
      />)
    }

    return (
      <div className="board-column">
        {column}
      </div>
    );
  }

}

export default Column;
