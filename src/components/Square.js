import React from 'react';

class Square extends React.Component {

  renderSquare = () => {
    const neighbors = this.props.squareState.neighbors;
    const bomb = this.props.squareState.bomb;
    const clicked = this.props.squareState.clicked
    if (bomb && clicked) {
      return (
        <div >
          <img className="bomb-image" src="/images/bomb.png" alt="bomb"/>
        </div>)
    } else if (!bomb && neighbors > 0 && clicked){
      return (
        <span className={`${neighbors}-neighbors`}>{neighbors}</span>
      )
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
