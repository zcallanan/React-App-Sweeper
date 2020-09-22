import React from 'react';
import Form from './Form';
import Row from './Row';
import Flag from './Flag';
import { randomIntFromInterval } from '../helpers';

class App extends React.Component {
  // Initialize state
  state = {
    options: {
      size: 0,
      difficulty: 0
    },
    bombPercentage: {
      0: "10%",
      1: "20%",
      2: "30%",
      3: "45%",
      4: "60%",
      5: "75%"
    },
    squares: {},
    flag: false
  }

  componentDidMount() {
    let options = { ...this.state.options };
    // Read options from local storage
    const localStorageRef = localStorage.getItem("options");
    if (localStorageRef) {
      options = JSON.parse(localStorageRef);
    } else {
      // No local storage
      options["size"] = 10;
      options["difficulty"] = 2;
    }
    this.setState({ options });
    this.initSquares(options.size);
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
    // 4. Save options to local storage
    localStorage.setItem("options", JSON.stringify(options));
  }

  onFlagClick = e => {
    e.preventDefault();
    // 1. Get state of flag
    let flag = this.state.flag;
    // 2. Change flag setting
    flag = !flag;
    // 3. Save change
    this.setState({ flag })
  }

  // Generate initial squares state
  initSquares = size => {
    // 1. Copy state
    const squares = {...this.state.squares};
    // 2. Build squares object
    for (let i = 0; i < size; i++) {
      for (let k = 0; k < size; k++ ) {
        squares[`r${i}-s${k}`] = {
          bomb: false,
          marked: false,
          clicked: false,
          hint: false,
          neighbors: [],
          adjacentBombCount: 0
        }
      }
    }
    // 3. SetState
    this.setState({ squares });
    // 4. Determine what squares have bombs
    setTimeout(() => this.setBombs(), 400);
  }

  checkNeighbors = (squareKey, squares) => {
    squares[squareKey]['neighbors'].forEach(neighbor => {
      if (squares[neighbor]['adjacentBombCount'] > 0 && !squares[neighbor]['clicked'] && !squares[neighbor]['hint']) {
        // If a neighbor has an adjacent bomb, hasn't been clicked or had its hint revealed, then reveal its hint
        squares[neighbor]['hint'] = true;
      } else if (squares[neighbor]['adjacentBombCount'] === 0 && !squares[neighbor]['bomb'] && !squares[neighbor]['clicked'] && !squares[neighbor]['hint']) {
        // If a neighbor has no adjacent bombs, isn't a bomb, has no revealed hint or been clicked, then mark as clicked and check its neighbors
        squares[neighbor]['clicked'] = true;
        this.checkNeighbors(neighbor, squares);
      }
    })
    return;
  }

  onSquareClick = (squareKey, e) => {
    // 1. Copy state
    const squares = { ...this.state.squares };
    const flag = this.state.flag;
    // 2. Update square
    if (flag) {
      // If marking a flag is active, then mark only that square and then save to state
      squares[squareKey]['marked'] = !squares[squareKey]['marked'];
    } else {
      // If not marking a flag, then mark as clicked and evaluate
      squares[squareKey]['clicked'] = true;
      // e.currentTarget.setAttribute("disabled", "")
      if (squares[squareKey]['adjacentBombCount'] > 0 && !squares[squareKey]['bomb']) {
        // Click on a square with an adjacent bomb, reveal its hint
        squares[squareKey]['hint'] = true;
      }
      if (!squares[squareKey]['bomb']) {
        // Check neighbors to determine whether to click them or show their hint. Those with hints CAN be bombs
        this.checkNeighbors(squareKey, squares);
      }
    }
    // 3. Save state
    this.setState({ squares });
  }

  countAdjacentBombs = square => {
    const size = this.state.options.size;
    const squareRow = square.split("-")[0].match(/\d{1,3}/);
    const row = parseInt(squareRow[0]);
    const squarePos = square.split("-")[1].match(/(\d{1,3})/);
    const s = parseInt(squarePos[0]);
    const neighbors = [];
    if (row - 1 >= 0) {
      // If it's not the first row
      neighbors.push(`r${row - 1}-s${s}`);
      if (s - 1 >= 0) {
      // If it's not the first column
        neighbors.push(`r${row - 1}-s${s - 1}`);
      }
      if (s + 1 !== size) {
        // If it's not the last column
        neighbors.push(`r${row - 1}-s${s + 1}`);
      }
    }
    if (s - 1 >= 0) {
      neighbors.push(`r${row}-s${s - 1}`);
    }
    if (s + 1 !== size) {
      neighbors.push(`r${row}-s${s + 1}`);
    }
    if (row + 1 !== size) {
      // If it's not the last row
      neighbors.push(`r${row + 1}-s${s}`);
      if (s - 1 >= 0) {
        // If it's not the first column
        neighbors.push(`r${row + 1}-s${s - 1}`);
      }
      if (s + 1 !== size) {
        // If it's not the last column
        neighbors.push(`r${row + 1}-s${s + 1}`);
      }
    }
    // 1. Copy squares
    const squares = { ...this.state.squares }
    // 2. Iterate over neighbor and check for bombs
    let adjacentBombCount = 0;
    neighbors.forEach(neighbor => {
      if (squares[neighbor].bomb) {
        adjacentBombCount++;
      }
    })
    // 3. Set state neighbor count
    squares[square].neighbors = neighbors;
    squares[square].adjacentBombCount = adjacentBombCount;
    this.setState({ squares });
  }


  // Recursive function that returns an object with bombCount positions
  generatePositions = (positionArray, squares, bombCount, optionSize, count) => {
    if (count > bombCount - 1) {
      // stop recursive call
      return squares;
    }
    let tempPosition = `r${randomIntFromInterval(0, optionSize - 1)}-s${randomIntFromInterval(0, optionSize - 1)}`;
    if (!positionArray.includes(tempPosition)) {
      squares[tempPosition]['bomb'] = true;
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
    // Determine adjacent bomb count
    setTimeout(() => Object.keys(squares).map(key => this.countAdjacentBombs(key)), 400);
  }

  render() {
    const rows = [];
    for (let i = 0; i < this.state.options.size; i++) {
      rows.push(<Row
        key={`r${i}`}
        row={`r${i}`}
        flag={this.state.flag}
        squares = {this.state.squares}
        total={this.state.options.size}
        onSquareClick={this.onSquareClick}
      />)
    }

    return (
      <div className="game-board">
        <Form
          options={this.state.options}
          saveOptions={this.saveOptions}
          initSquares={this.initSquares}
          setBombs={this.setBombs}
          percentages={this.state.bombPercentage}
        />
        {rows}
        <Flag onFlagClick={this.onFlagClick}/>
      </div>
    )
  }
}

export default App;
