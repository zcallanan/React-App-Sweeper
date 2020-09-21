import React from 'react';

class Square extends React.Component {

  renderSquare = () => {
    if (this.props.squareState.bomb && this.props.squareState.clicked) {
      return (
        <div >
          <img className="bomb-image" src="/images/bomb.png" alt="bomb"/>
        </div>)
    } else if (!this.props.squareState.bomb && this.props.squareState.neighbors === 1 && this.props.squareState.clicked){
      return (
          <span className="one-neighbor">{this.props.squareState.neighbors}</span>
      )
    } else if (!this.props.squareState.bomb && this.props.squareState.neighbors === 2 && this.props.squareState.clicked){
      return (
          <span className="two-neighbors">{this.props.squareState.neighbors}</span>
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
