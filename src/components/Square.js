import React from 'react';

class Square extends React.Component {

  renderSquare = () => {
    const squareState = this.props.squareState;
    const adjacentBombCount = squareState.adjacentBombCount;
    const bomb = squareState.bomb;
    const clicked = squareState.clicked;
    const hint = squareState.hint;
    if (bomb && clicked) {
      return (
        <div >
          <img className="bomb-image" src="/images/bomb.png" alt="bomb"/>
        </div>)
    } else if (!bomb && adjacentBombCount > 0 && (hint || clicked)) {
      return (
        <span className={`${adjacentBombCount}-neighbors`}>{adjacentBombCount}</span>
      )
    } else if (!bomb && adjacentBombCount === 0 && clicked) {
      return;
    }
    return "?"
  }

  render() {
    return (
      <button className="square" onClick={() => this.props.onSquareClick(this.props.square)}>
        {this.renderSquare()}
      </button>
    );
  }

}

export default Square;
