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
    bombPositions: {}
  }

  // Save Player's game board size entry
  saveOptions = (count, difficulty) => {
    // 1. Copy state
    const options = this.state.options;
    // 2. Add new value to state
    options["size"] = parseInt(count);
    options["difficulty"] = parseInt(difficulty);
    // 3. SetState
    this.setState({ options });
  }

  onSquareClick = key => {

  }

  // Recursive function that returns an object with bombCount positions
  generatePositions = (positionArray, bombPositions, bombCount, optionSize, count) => {
    if (count > bombCount - 1) {
      // stop recursive call
      return bombPositions;
    }
    console.log(bombPositions[count])
    let tempPosition = `r${randomIntFromInterval(0, optionSize - 1)}s${randomIntFromInterval(0, optionSize - 1)}`;
    if (!positionArray.includes(tempPosition)) {

      bombPositions[count] = { square: tempPosition, marked: false }
      positionArray.push(tempPosition);
      count++;
    }
    this.generatePositions(positionArray, bombPositions, bombCount, optionSize, count)
  }

  // Use user input to call bomb position fn and save positions to state
  setBombs = () => {
    let percentage;
    let positionArray = []
    // Copy game board dimension
    const options = {...this.state.options};
    // Get percentage of bombs
    for (const [key, value] of Object.entries(this.state.bombPercentage)) {
      if (parseInt(key) === options.difficulty) {
        percentage = parseFloat(value) * .01;
      }
    }
    // Calculate number of bombs
    const bombCount = (options.size ** 2) * percentage;
    let bombPositions = {};
    // Generate bomb positions
    this.generatePositions(positionArray, bombPositions, bombCount, options.size, 0)
    // Save bomb positions
    this.setState({bombPositions});
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
        <Form saveOptions={this.saveOptions} setBombs={this.setBombs} />
        {rows}
      </div>
    )
  }
}

export default App;
