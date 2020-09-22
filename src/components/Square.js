import React from 'react';

class Square extends React.Component {

  renderSquare = () => {
    const squareState = this.props.squareState;
    const adjacentBombCount = squareState.adjacentBombCount;
    const bomb = squareState.bomb;
    const clicked = squareState.clicked;
    const hint = squareState.hint;
    const marked = squareState.marked;
    if (bomb && clicked) {
      // If it's a bomb and clicked, show the bomb
      return (
        <div >
          <img className="image" src="/images/bomb.png" alt="B"/>
        </div>)
    } else if (marked && !clicked) {
      return (
        <img className="image" src="/images/flag.png" alt="F"/>
      )
    } else if (hint && !clicked) {
      // If it has an adjacent bomb, has not been clicked, hint is true, show the hint
      return (
        <p className={`neighbors-${adjacentBombCount}`}>{adjacentBombCount}</p>
      )
    } else if (!bomb && clicked) {
      // Not a bomb, has been clicked
      return;
    }
    return "?";
  }

  generateButton = () => {
    // Disable the button if it's been clicked
    if (this.props.squareState.clicked) {
      return (
        <button className="square" disabled>
          {this.renderSquare()}
        </button>
      );
    }
    // Return initial functional button
    return (
      <button className="square" onClick={(e) => { this.props.onSquareClick(this.props.square, e)}}>
        {this.renderSquare()}
      </button>
    );
  }

  render() {
    return (
      <div>
        {this.generateButton()}
      </div>
    );
  }

}

export default Square;
