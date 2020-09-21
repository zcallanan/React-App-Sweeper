import React from 'react';
import Form from './Form';
import Row from './Row';
import { randomIntFromInterval } from '../helpers'

class App extends React.Component {
  // Initialize state
  state = {
    options: {},
    bombPercentage: {
      0: "35%",
      1: "50%",
      2: "65%"
    },
    squares: {}
  }

  // Save Player's game board options
  saveOptions = (count, difficulty) => {
    // 1. Copy state
    const options = this.state.options;
    // 2. Add new value to state
    options["size"] = parseInt(count);
    options["difficulty"] = parseInt(difficulty);
    // 3. SetState
    this.setState({ options });
  }

  // Generate initial squares state
  initSquares = size => {
    // 1. Copy state
    const squares = {...this.state.squares};
    // 2. Build squares object
    for (let i = 0; i < size; i++) {
      for (let k = 0; k < size; k++ ) {
        squares[`r${i}s${k}`] = {
          bomb: false,
          marked: false
        }
      }
    }
    // 3. SetState
    this.setState({ squares })
    // 4. Determine what squares have bombs
    setTimeout(() => this.setBombs(), 400);
  }

  onSquareClick = key => {

  }

  // Recursive function that returns an object with bombCount positions
  generatePositions = (positionArray, squares, bombCount, optionSize, count) => {
    if (count > bombCount - 1) {
      // stop recursive call
      return squares;
    }
    let tempPosition = `r${randomIntFromInterval(0, optionSize - 1)}s${randomIntFromInterval(0, optionSize - 1)}`;
    if (!positionArray.includes(tempPosition)) {
      squares[tempPosition] = {
        bomb: true,
        marked: false
      }
      positionArray.push(tempPosition);
      count++;
    }
    // If position was a dupe, count remains the same, otherwise a new bomb's position is generated
    this.generatePositions(positionArray, squares, bombCount, optionSize, count)
  }

  // Use user input to call bomb position fn and save positions to state
  setBombs = () => {
    let percentage;
    let positionArray = []
    // Copy game board dimension
    const options = {...this.state.options};
    const squares = {...this.state.squares};
    // Get percentage of bombs
    for (const [key, value] of Object.entries(this.state.bombPercentage)) {
      if (parseInt(key) === options.difficulty) {
        percentage = parseFloat(value) * .01;
      }
    }
    // Calculate number of bombs
    const bombCount = (options.size ** 2) * percentage;
    // Generate bomb positions
    this.generatePositions(positionArray, squares, bombCount, options.size, 0);
    // Save bomb positions
    this.setState({squares});
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
        <Form
          saveOptions={this.saveOptions}
          initSquares={this.initSquares}
          setBombs={this.setBombs}
          percentages={this.state.bombPercentage}
        />
        {rows}
      </div>
    )
  }
}

export default App;
