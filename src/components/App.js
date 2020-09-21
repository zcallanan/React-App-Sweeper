import React from 'react';
import Form from './Form';
import Row from './Row';

class App extends React.Component {
  // Initialize state
  state = {
    options: {}
  }

  // Save Player's game board size entry
  saveOptions = (count, difficulty) => {
    // 1. Copy state
    let options = this.state.options;
    // 2. Add new value to state
    options["size"] = parseInt(count);
    options["difficulty"] = parseInt(difficulty);
    // 3. SetState
    this.setState({ options });
  }

  onSquareClick = key => {

  }

  render() {
    const rows = [];
    for (let i = 0; i < this.state.options.size; i++) {
      rows.push(<Row
        key={`r${i}`}
        row={`r${i}`}
        total={this.state.options.size}
        onSquareClick={this.onSquareClick}
      />)
    }

    return (
      <div className="game-board">
        <Form saveOptions={this.saveOptions} />
        {rows}
      </div>
    )
  }
}

export default App;
