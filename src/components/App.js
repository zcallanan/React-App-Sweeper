import React from 'react';
import Form from './Form';
import Row from './Row';
import Flag from './Flag';
import Header from './Header';
import QuestionMark from './QuestionMark';
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
    marks: {
      flagMode: false,
      flagCount: 0,
      questionMode: false
    }

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

  // Toggle state when mark buttons are clicked (flag, question mark)
  onMarkClick = e => {
    e.preventDefault();
    // 1. Get state of flag
    let marks = this.state.marks;
    // 2. Change flag setting
    marks[e.target.name] = !marks[e.target.name];
    // 3. If mode X toggles to true, then make sure mode Y is false
    if ("flagMode" === e.target.name && marks[e.target.name]) {
      marks["questionMode"] = false;
    } else if ("questionMode" === e.target.name && marks[e.target.name]){
      marks["flagMode"] = false;
    }
    // 4. Save change
    this.setState({ marks })
  }

  // Generate initial squares state
  initSquares = size => {
    // 1. Copy state
    let squares = {...this.state.squares};
    // If size decreases, then square keys should be deleted before the board is regenerated
    let row;
    let column;
    Object.keys(squares).map(square => {
      row = parseInt(square.split("-")[0].match(/\d{1,3}/)[0]);
      column = parseInt(square.split("-")[1].match(/(\d{1,3})/)[0]);
      if (row > this.state.options.size - 1 || column > this.state.options.size - 1) {
        // Check to see if squares has any rows or columns greater than the board size - 1
        delete squares[square];
      }
      return squares;
    })
    // 2. Build squares object
    for (let i = 0; i < size; i++) {
      for (let k = 0; k < size; k++ ) {
        squares[`r${i}-s${k}`] = {
          bomb: false,
          flagged: false,
          questionMarked: false,
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
    setTimeout(() => this.setBombs(), 200);
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

  onSquareClick = squareKey => {
    // 1. Copy state
    const squares = { ...this.state.squares };
    const flagMode = this.state.marks.flagMode;
    const questionMode = this.state.marks.questionMode;
    // 2. Update square
    if (flagMode) {
      // If marking a flag is active, then mark only that square and then save to state
      squares[squareKey]['flagged'] = !squares[squareKey]['flagged'];
    } else if (questionMode) {
      // If placing a question mark is active, then mark only that square and then save to state
      squares[squareKey]['questionMarked'] = !squares[squareKey]['questionMarked'];
    } else {
      // If not marking a flag, then mark as clicked and evaluate
      squares[squareKey]['clicked'] = true;
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
    const row = parseInt(square.split("-")[0].match(/\d{1,3}/)[0]);
    const column = parseInt(square.split("-")[1].match(/(\d{1,3})/)[0]);
    const neighbors = [];
    if (row - 1 >= 0) {
      // If it's not the first row
      neighbors.push(`r${row - 1}-s${column}`);
      if (column - 1 >= 0) {
      // If it's not the first column
        neighbors.push(`r${row - 1}-s${column - 1}`);
      }
      if (column + 1 !== size) {
        // If it's not the last column
        neighbors.push(`r${row - 1}-s${column + 1}`);
      }
    }
    if (column - 1 >= 0) {
      neighbors.push(`r${row}-s${column - 1}`);
    }
    if (column + 1 !== size) {
      neighbors.push(`r${row}-s${column + 1}`);
    }
    if (row + 1 !== size) {
      // If it's not the last row
      neighbors.push(`r${row + 1}-s${column}`);
      if (column - 1 >= 0) {
        // If it's not the first column
        neighbors.push(`r${row + 1}-s${column - 1}`);
      }
      if (column + 1 !== size) {
        // If it's not the last column
        neighbors.push(`r${row + 1}-s${column + 1}`);
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
    Object.keys(squares).map(key => this.countAdjacentBombs(key))
    //setTimeout(() => Object.keys(squares).map(key => this.countAdjacentBombs(key)), 400);
  }

  render() {
    const rows = [];
    for (let i = 0; i < this.state.options.size; i++) {
      rows.push(<Row
        key={`r${i}`}
        row={`r${i}`}
        marks={this.state.marks}
        squares={this.state.squares}
        size={this.state.options.size}
        onSquareClick={this.onSquareClick}
      />)
    }

    return (
      <div className="game-board">
        <Header />
        <Form
          options={this.state.options}
          saveOptions={this.saveOptions}
          initSquares={this.initSquares}
          setBombs={this.setBombs}
          percentages={this.state.bombPercentage}
        />
        {rows}
        <Flag onMarkClick={this.onMarkClick} flagMode={this.state.marks.flagMode}/>
        <QuestionMark onMarkClick={this.onMarkClick} questionMode={this.state.marks.questionMode}/>
      </div>
    )
  }
}

export default App;
