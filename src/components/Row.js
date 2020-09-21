import React from 'react';
import Square from './Square'

class Row extends React.Component {
  renderSquare = () => {

  }



  render() {
    const row = [];
    for (let i = 0; i < this.props.total; i++) {
      row.push(<Square
        key={`${this.props.row}s${i}`}
        square={`${this.props.row}s${i}`}
        onSquareClick={this.props.onSquareClick}
      />)
    }

    return (
      <div className="board-row">
        {row}
      </div>
    );
  }

}

export default Row;
