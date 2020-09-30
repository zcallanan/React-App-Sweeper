import React from 'react';
import Form from './Form';
import Column from './Column';
import Flag from './Flag';
import Header from './Header';
import QuestionMark from './QuestionMark';
import Stats from './Stats';
import Notice from './Notice';
import { randomIntFromInterval } from '../helpers';

class App extends React.Component {
  // Initialize state
  state = {
    options: { // user input settings, loaded from localStorage if available
      size: 0,
      difficulty: 0,
      lives: 0
    },
    data: { // hard coded data
      bombPercentage: {
        0: "10%",
        1: "20%",
        2: "30%",
        3: "45%",
        4: "60%",
        5: "75%"
      },
      numberOfLives: {
        0: "0",
        1: "1",
        2: "3",
        3: "6",
        4: "9",
        5: "99"
      }
    },
    squares: { // game board framework
      "r0-s0": {
        bomb: false,
        flagged: false,
        questionMarked: false,
        clicked: false,
        hint: false,
        neighbors: [],
        adjacentBombCount: -1,
        explosion: {
          explodeTrigger: false,
          explodeTimer: false,
          explodeCleanup: false
        }
      }
    },
    modes: {
      bombMode: false, // Struck a bomb, locks input
      flagMode: false, // Place a flag on a square
      questionMode: false // Place a question mark on a square
    },
    stats: { // game stats
      currentLives: -1,
      bombs: -1,
      revealed: 0,
      flags: 0,
      questions: 0
    },
    notices: { // game notices
      bombNotice: false
    }
  }

  componentDidMount() {
    let options = { ...this.state.options };
    const stats = this.state.stats;
    const data = this.state.data;
    // Read options from local storage
    const localStorageRef = localStorage.getItem("options");
    if (localStorageRef) {
      options = JSON.parse(localStorageRef);
    } else {
      // No local storage
      options["size"] = 10;
      options["difficulty"] = 2;
      options["lives"] = 2;
    }
    // Get initial number of lives
    stats["currentLives"] = parseInt(data["numberOfLives"][options["lives"]])
    this.setState({ options, stats });
    this.initSquares(options.size);
  }

  // Save Player's game board options
  saveOptions = obj => {
    // 1. Copy state
    const options = this.state.options;
    const stats = this.state.stats;
    const data = this.state.data;
    // 2. Add new value to state
    options["size"] = parseInt(obj["size"]);
    options["difficulty"] = parseInt(obj["difficulty"]);
    options["lives"] = parseInt(obj["lives"]);
    // Get initial number of lives
    stats["currentLives"] = parseInt(data["numberOfLives"][options["lives"]])
    // 3. SetState
    this.setState({ options, stats });
    // 4. Save options to local storage
    localStorage.setItem("options", JSON.stringify(options));
  }

  // Toggle state when mode buttons are clicked (flag, question mark)
  onModeClick = e => {
    e.preventDefault();
    // 1. Get state of flag
    let modes = this.state.modes;
    // 2. Change flag setting
    modes[e.target.name] = !modes[e.target.name];
    // 3. If mode X toggles to true, then make sure mode Y is false
    if ("flagMode" === e.target.name && modes[e.target.name]) {
      modes["questionMode"] = false;
    } else if ("questionMode" === e.target.name && modes[e.target.name]){
      modes["flagMode"] = false;
    }
    // 4. Save change
    this.setState({ modes })
  }

  // Cleanup bombMode, resetting bomb square, reset bombNotice, and remove disabled from clickable squares
  explodeCleanup = squareKey => {
    const squares = {...this.state.squares};
    squares[squareKey].explosion.explodeTrigger = false;
    squares[squareKey].explosion.explodeTimer = false;
    squares[squareKey].explosion.explodeCleanup = true;
    // Remove display notice
    const notices = {...this.state.notices};
    notices.bombNotice = false;
    this.setState({squares, notices});
    setTimeout(() => {
      const squares = {...this.state.squares};
      const modes = {...this.state.modes};
      // Reset square and hide the bomb
      squares[squareKey].clicked = false;
      // Remove disabling of buttons
      modes.bombMode = false;
      this.setState({squares, modes});
    }, 1000);

  }

  // Called by square component when clicking on a bomb square
  explode = squareKey => {
    let squares = {...this.state.squares};
    if (!squares[squareKey].explosion.explodeCleanup) {
      // Prevent further animations if it's time to cleanup
      squares[squareKey].explosion.explodeTrigger = false;
      this.setState({squares})
      setTimeout(() => {
        // Prompt bomb animation every second
        squares = {...this.state.squares};
        squares[squareKey].explosion.explodeTrigger = true;
        this.setState({squares})
      }, 1000)
      if (!squares[squareKey].explosion.explodeTimer) {
        // Start a timer to stop bomb animation
        squares = {...this.state.squares};
        // Timer started, prevent it from starting again
        squares[squareKey].explosion.explodeTimer = true;
        setTimeout(() => {
          // Update lives count here
          const stats = {...this.state.stats};
          stats.currentLives--;
          this.setState({ stats })
        }, 2000)
        setTimeout(() => {
          this.explodeCleanup(squareKey);
        }, 5000)
      }
    } else {
      // Reset cleanup back to default
      squares[squareKey].explosion.explodeCleanup = false;
    }
  }

  // Called by square component when clicking on a square
  onSquareClick = squareKey => {
    // 1. Copy state
    const squares = { ...this.state.squares };
    const stats = { ...this.state.stats }
    const bomb = squares[squareKey]['bomb'];
    const adjacentBombCount = squares[squareKey]['adjacentBombCount'];
    const flagMode = this.state.modes.flagMode;
    const questionMode = this.state.modes.questionMode;
    // 2. Update square
    if (flagMode) {
      // If marking a flag is active, then mark only that square and then save to state
      squares[squareKey]['flagged'] = !squares[squareKey]['flagged'];
      if (squares[squareKey]['flagged']) {
        // If a flag is placed, increment the flag count
        stats.flags++;
        this.setState({ stats })
      } else {
        // If a flag is removed, decrement the flag count
        stats.flags--;
        this.setState({ stats })
      }
      if (squares[squareKey]['questionMarked']) {
        // If the square is question marked when placing a flag, remove questionMarked
        squares[squareKey]['questionMarked'] = !squares[squareKey]['questionMarked'];
      }
    } else if (questionMode) {
      // If placing a question mark is active, then mark only that square and then save to state
      squares[squareKey]['questionMarked'] = !squares[squareKey]['questionMarked'];
      if (squares[squareKey]['questionMarked']) {
        // If a question mark is placed, increment the question mark count
        stats.questions++;
        this.setState({ stats })
      } else {
        // If a question mark is removed, decrement the question mark count
        stats.questions--;
        this.setState({ stats })
      }
      if (squares[squareKey]['flagged']) {
        // If the square is flagged when placing a question mark, unflag it
        squares[squareKey]['flagged'] = !squares[squareKey]['flagged'];
      }
    } else {
      // Mark as clicked and evaluate
      squares[squareKey]['clicked'] = true;
      if (!bomb) {
        // Increment revealed
        let stats = {...this.state.stats};
        stats['revealed']++;
        // Check neighbors to determine whether to click them or show their hint. Those with hints CAN be bombs
        stats = this.checkNeighbors(squareKey, squares, stats);
        this.setState({ stats });
        if (adjacentBombCount > 0) {
          // Click on a square with an adjacent bomb, reveal its hint
          squares[squareKey]['hint'] = true;
        }
      } else {
        // Clicked on a bomb
        const notices = {...this.state.notices};
        const modes = {...this.state.modes}
        modes.bombMode = true;
        notices.bombNotice = true;
        squares[squareKey].explosion.explodeTrigger = true;
        this.setState({squares, notices, modes})

        if (stats.currentLives === 0) {
          // TODO: Game over

        } else {
          // TODO: Prompt to continue

        }
      }
    }
    // 3. Save state
    this.setState({ squares });
  }

  // Generate initial squares state
  initSquares = size => {
    // 1. Copy state
    let squares = {...this.state.squares};
    // Make sure that the revealed stat is set to zero at the start
    const stats = {...this.state.stats};
    stats["revealed"] = 0;
    stats["flags"] = 0;
    stats["questions"] = 0;
    this.setState({stats});
    // If size decreases, then square keys should be deleted before the board is regenerated
    if (Object.keys(squares).length > 1) {
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
    }

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
          adjacentBombCount: -1,
          explosion: {
            explodeTrigger: false,
            explodeTimer: false,
            explodeCleanup: false
          }
        }
      }
    }
    // 3. SetState
    this.setState({ squares });
    // 4. Determine what squares have bombs
    setTimeout(() => this.setBombs(), 200);
  }

  // Use user input to call bomb position fn and save positions to state
  setBombs = () => {
    let percentage;
    let positionArray = []
    // Copy game board dimension
    const options = {...this.state.options};
    const squares = {...this.state.squares};
    const stats = {...this.state.stats}
    // Get percentage of bombs
    for (const [key, value] of Object.entries(this.state.data.bombPercentage)) {
      if (parseInt(key) === options.difficulty) {
        percentage = parseFloat(value) * .01;
      }
    }
    // Calculate number of bombs
    const bombCount = Math.floor((options.size ** 2) * percentage);
    // Save bombCount to stats
    stats.bombs = bombCount;
    this.setState({stats});
    // Generate bomb positions
    this.generatePositions(positionArray, squares, bombCount, options.size, 0);
    // Save bomb positions
    this.setState({squares});
  }

  // Called by this.onSquareClick() to determine whether a square's neighbors are bombs or have adjacent bombs
  checkNeighbors = (squareKey, squares, stats) => {
    let neighbors;
    if ((squares[squareKey]['neighbors'] === 'undefined' || squares[squareKey]['neighbors'].length === 0) || squares[squareKey]['adjacentBombCount'] === -1 ) {
      // If squareKey has no neighbors or its adjacent bombs have not been counted, then call countAdjacentBombs
      neighbors = this.countAdjacentBombs(squareKey);
    } else {
      neighbors = squares[squareKey]['neighbors'];
    }
    neighbors.forEach(neighbor => {
      if ((squares[neighbor]['neighbors'] === 'undefined' || squares[neighbor]['neighbors'].length === 0) || squares[neighbor]['adjacentBombCount'] === -1 ) {
        this.countAdjacentBombs(neighbor);
      }
      if (squares[neighbor]['adjacentBombCount'] > 0 && !squares[neighbor]['clicked'] && !squares[neighbor]['hint']) {
        // If a neighbor has an adjacent bomb, hasn't been clicked or had its hint revealed, then reveal its hint
        squares[neighbor]['hint'] = true;
      } else if (squares[neighbor]['adjacentBombCount'] === 0 && !squares[neighbor]['bomb'] && !squares[neighbor]['clicked'] && !squares[neighbor]['hint']) {
        // If a neighbor has no adjacent bombs, isn't a bomb, has no revealed hint or been clicked, then mark as clicked and check its neighbors
        squares[neighbor]['clicked'] = true;
        // Increment revealed
        stats['revealed']++;
        this.checkNeighbors(neighbor, squares, stats);
      }
    })
    return stats;
  }

  // Called by this.checkNeighbors() to determine who is a neighbor of a square and tally that square's adjacent bomb count
  countAdjacentBombs = squareKey => {
    const size = this.state.options.size;
    const row = parseInt(squareKey.split("-")[0].match(/\d{1,3}/)[0]);
    const column = parseInt(squareKey.split("-")[1].match(/(\d{1,3})/)[0]);
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
    squares[squareKey].neighbors = neighbors;
    squares[squareKey].adjacentBombCount = adjacentBombCount;
    this.setState({ squares });
    return neighbors;
  }


  // Called by this.setBombs(), recursive function that determines whether a square has a bomb
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

  render() {
    const columns = [];
    for (let i = 0; i < this.state.options.size; i++) {
      columns.push(<Column
        key={`s${i}`}
        columnKey={`s${i}`}
        modes={this.state.modes}
        squares={this.state.squares}
        size={this.state.options.size}
        onSquareClick={this.onSquareClick}
        explode={this.explode}
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
          percentages={this.state.data.bombPercentage}
          lives={this.state.data.numberOfLives}
        />
        <div className="game-body">
          <div className="squares">
            {columns}
          </div>
          <div>
            <Notice notices={this.state.notices} />
            <Stats
              stats={this.state.stats}
              options={this.state.options}
            />
          </div>

        </div>
        <div className="modes">
          <Flag onModeClick={this.onModeClick} flagMode={this.state.modes.flagMode}/>
          <QuestionMark onModeClick={this.onModeClick} questionMode={this.state.modes.questionMode}/>
        </div>
      </div>
    )
  }
}

export default App;
