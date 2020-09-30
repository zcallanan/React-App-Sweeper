import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';

class Column extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    columnKey: PropTypes.string.isRequired,
    modes: PropTypes.object.isRequired,
    squares: PropTypes.object.isRequired,
    onSquareClick: PropTypes.func.isRequired
  }

  render() {
    const column = [];
    for (let i = 0; i < this.props.size; i++) {
      column.push(<Square
        key={`r${i}-${this.props.columnKey}`}
        squareKey={`r${i}-${this.props.columnKey}`}
        modes={this.props.modes}
        squareData={this.props.squares[`r${i}-${this.props.columnKey}`]}
        onSquareClick={this.props.onSquareClick}
        explode={this.props.explode}
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
