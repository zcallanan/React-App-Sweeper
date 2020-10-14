import React from 'react';
import Modal from "react-bootstrap/Modal";
import Form from './Form';
import Column from './Column';
import Flag from './Flag';
import Header from './Header';
import QuestionMark from './QuestionMark';
import Stats from './Stats';
import Notice from './Notice';
import { randomIntFromInterval } from '../helpers';

interface Props {
}

interface State {
  gameState: gameStateType,
  data: dataType,
  squares: squaresType,
  modes: modesType,
  stats: statsType,
  notices: noticesType,
  animations: animationsType,
  modal: modalType
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      gameState : {
        progress: 0, // -1 defeat, 0 mid-game, 1 victory
        options: { // User input settings, loaded from localStorage if available
          size: 0,
          difficulty: 0,
          lives: 0
        }
      },
      data: { // Hard coded data
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
          2: "2",
          3: "5",
          4: "9",
          5: "99"
        }
      },
      squares: { // Game board framework
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
            explodeCleanup: false,
            explodeFire: false
          }
        }
      },
      modes: {
        newGame: false, // Denotes the start of a new game before a square is selected
        bombMode: false, // Struck a bomb, locks input
        flagMode: false, // Place a flag on a square
        questionMode: false, // Place a question mark on a square
        drawing: true // On square init the initial board draws. After 1.5 seconds this is marked false
      },
      stats: { // Game stats
        currentLives: -1,
        bombs: -1,
        revealed: 0,
        totalToReveal: 0,
        flags: 0,
        questions: 0
      },
      notices: { // Game notices
        bombNotice: false,
        victoryNotice: false,
        defeatNotice: false
      },
      animations: { // Animation data to prompt reflows
        squareScroll: false,
        seed: randomIntFromInterval(1,9999),
        bombFade: false
      },
      modal: { // Custom Settings && win/loss modal
        isVisible: false, // Is the modal visible?
        timer: false, // Prevents multiple timers from starting in order to show a delayed modal on win/loss
        modalCleanup: false
      }
    }
  }

  /* Init */

  componentDidMount() {
    const gameState: gameStateType = { ...this.state.gameState };
    const modes: modesType = {...this.state.modes};
    const stats: statsType = {...this.state.stats};
    const data: dataType = {...this.state.data};
    // Game in progress
    gameState.progress = 0;
    // New Game
    modes.newGame = true;
    // Read options from local storage
    const localStorageRef = localStorage.getItem("sweeper-options");
    if (localStorageRef) {
      gameState.options = JSON.parse(localStorageRef);
    } else {
      // No local storage, set initial default falues
      gameState.options.size = 10;
      gameState.options.difficulty = 2;
      gameState.options.lives = 2;
    }
    // Get initial number of lives
    stats.currentLives = parseInt(data.numberOfLives[gameState.options.lives])
    this.setState({ gameState, stats, modes });
    // Generate game board
    this.initSquares(gameState.options.size);
  }

  // Save Player's game board options
  protected saveOptions = (obj: optionObj): void => {
    // 1. Copy state
    const gameState: gameStateType = this.state.gameState;
    const stats: statsType = this.state.stats;
    const modes: modesType = {...this.state.modes};
    const data: dataType = {...this.state.data};
    const modal: modalType = {...this.state.modal};
    const animations: animationsType = {...this.state.animations};
    modes.newGame = true;
    this.toggleScroll(true, 'squareScroll');
    // Reset values on form submit
    animations.seed = randomIntFromInterval(1,9999);
    animations.bombFade = false;
    modal.timer = false;
    modal.isVisible = false;
    modal.modalCleanup = false;
    // 2. Add new value to state
    gameState.options.size = parseInt(obj.size);
    gameState.options.difficulty = parseInt(obj.difficulty);
    gameState.options.lives = parseInt(obj.lives);
    // Reset progress to wipe a win or loss
    gameState.progress = 0;
    // Get initial number of lives
    stats.currentLives = parseInt(data.numberOfLives[gameState.options.lives])
    // 3. SetState
    this.setState({ gameState, stats, modes, animations, modal });
    // 4. Save options to local storage
    localStorage.setItem("sweeper-options", JSON.stringify(gameState.options));
  }

  // Generate initial squares state
  protected initSquares = (size: number): void => {
    // 1. Copy state
    let squares: squaresType = {...this.state.squares};
    // Cleanup a previous game
    const stats: statsType = {...this.state.stats};
    const notices: noticesType = {...this.state.notices};
    stats.revealed = 0;
    stats.flags = 0;
    stats.questions = 0;
    notices.bombNotice = false;
    notices.victoryNotice = false;
    notices.defeatNotice = false;
    this.setState({stats, notices});
    // If size decreases, then square keys should be deleted before the board is regenerated
    if (Object.keys(squares).length > 1) {
      let row: number = 0;
      let column: number = 0;
      Object.keys(squares).map((square: string) => {
        row = parseInt(square!.split("-")[0].match(/\d{1,3}/)[0]);
        column = parseInt(square!.split("-")[1].match(/(\d{1,3})/)[0]);
        if (row > this.state.gameState.options.size - 1 || column > this.state.gameState.options.size - 1) {
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
            explodeCleanup: false,
            explodeFire: false
          }
        }
      }
    }
    // 3. SetState
    this.setState({ squares });
    // 4. Determine what squares have bombs
    setTimeout(() => this.setBombs(), 200);
    setTimeout(() => { // When the board initially draws input is disabled. This timer enables the board
      const modes = {...this.state.modes};
      modes.drawing = false;
      this.setState({modes});
    }, 1500) // Timer synced with square draw anim transition of 1.5s
  }

  // Use user input to call bomb position fn and save positions to state
  protected setBombs = (): void => {
    let percentage: number;
    let positionArray: Array<string> = []
    // Copy game board dimension
    const options: optionType = {...this.state.gameState.options};
    const squares: squaresType = {...this.state.squares};
    const stats: statsType = {...this.state.stats}
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
    // Generate bomb positions
    this.generatePositions(positionArray, squares, bombCount, options.size, 0);
    // Save bomb positions
    this.setState({squares, stats});
  }

  // Called by this.setBombs(), recursive function that determines whether a square has a bomb
  protected generatePositions = (positionArray: Array<string>, squares: squaresType, bombCount: number, optionSize: number, count: number): squaresType => {
    if (count > bombCount - 1) {
      // stop recursive call
      return squares;
    }
    let tempPosition: string = `r${randomIntFromInterval(0, optionSize - 1)}-s${randomIntFromInterval(0, optionSize - 1)}`;
    if (!positionArray.includes(tempPosition)) {
      squares[tempPosition].bomb = true;
      positionArray.push(tempPosition);
      count++;
    }
    // If position was a dupe, count remains the same, otherwise a new bomb's position is generated
    this.generatePositions(positionArray, squares, bombCount, optionSize, count)
  }

  /* Props */

  // Prop for squares to update squareScroll state
  protected toggleScroll = (bool: boolean, anim: string): void => {
    const animations: animationsType = {...this.state.animations};
    animations[anim] = bool;
    this.setState({animations});
  }

  // Prop function for stats to pass to global state
  protected revealTarget = (totalToReveal: number) => {
    const stats: statsType = {...this.state.stats};
    if ((totalToReveal > 0 && stats.totalToReveal <= 0) || totalToReveal !== stats.totalToReveal) {
      stats.totalToReveal = totalToReveal;
      this.setState({stats});
    }
  }

  // Prop to toggle state when mode buttons are clicked (flag, question mark)
  protected onModeClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('what?')
    // 1. Get state of flag
    const modes: modesType = {...this.state.modes};
    // 2. Change flag setting
    modes[(e.target as HTMLFormElement).name] = !modes[(e.target as HTMLFormElement).name];
    // 3. If mode X toggles to true, then make sure mode Y is false
    if ("flagMode" === (e.target as HTMLFormElement).name && modes[(e.target as HTMLFormElement).name]) {
      modes.questionMode = false;
    } else if ("questionMode" === (e.target as HTMLFormElement).name && modes[(e.target as HTMLFormElement).name]){
      modes.flagMode = false;
    }
    // 4. Save change
    this.setState({ modes })
  }

  // Prop for Square component when clicking on a bomb square
  protected explode = (squareKey: string): void => {
    let squares: squaresType = {...this.state.squares};
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
          this.explodeCleanup(squareKey);
        }, 3000) // bomb explosion timer
      }
    } else {
      // Reset cleanup back to default
      squares[squareKey].explosion.explodeCleanup = false;
      squares[squareKey].explosion.explodeTrigger = false;
      squares = {...this.state.squares};
    }
  }

  // Cleanup bombMode, resetting bomb square, reset bombNotice, and remove disabled from clickable squares
  protected explodeCleanup = (squareKey: string): void => {
    const squares: squaresType = {...this.state.squares};
    const gameState: gameStateType = {...this.state.gameState};
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
      if (gameState.progress === 0) {
        squares[squareKey].clicked = false;
      } else if (gameState.progress === -1) {
        // Handle defeat bomb explosion progression
        squares[squareKey].explosion.explodeTrigger = false;
        squares[squareKey].explosion.explodeFire = true;
        this.setState({squares});
        setTimeout(() => {
          squares[squareKey].explosion.explodeFire = false;
          this.setState({squares});
        }, 1000)
        const modal = {...this.state.modal}
        if (!modal.isVisible) {
          // Handle displaying the play again modal upon defeat
          if (!modal.timer) {
            modal.timer = true;
            this.setState({modal});
            setTimeout(() => {
              this.modalShow();
              const modal = {...this.state.modal};
              modal.modalCleanup = true;
              this.setState({modal});
            }, 5000);
          }
        }
      }
      // Remove disabling of buttons
      modes.bombMode = false;
      this.setState({squares, modes});
    }, 1000); // triggers bomb explosion enter anim
  }

  // Prop for Square component when clicking on a square
  protected onSquareClick = (squareKey: string): void => {
    // 1. Copy state
    const squares: squaresType = { ...this.state.squares };
    let stats: statsType = { ...this.state.stats };
    const gameState: gameStateType = {...this.state.gameState};
    const notices: noticesType = {...this.state.notices};
    const modes: modesType = {...this.state.modes};
    const bomb: boolean = squares[squareKey].bomb;
    const adjacentBombCount: number = squares[squareKey].adjacentBombCount;
    const flagMode: boolean = modes.flagMode;
    const questionMode: boolean = modes.questionMode;
    if (modes.newGame) {
      modes.newGame = false;
      this.setState({modes});
    }
    // 2. Update square
    if (flagMode) {
      // If marking a flag is active, then mark only that square and then save to state
      squares[squareKey].flagged = !squares[squareKey].flagged;
      if (squares[squareKey].flagged) {
        // If a flag is placed, increment the flag count
        stats.flags++;
        this.setState({ stats })
      } else {
        // If a flag is removed, decrement the flag count
        stats.flags--;
        this.setState({ stats })
      }
      if (squares[squareKey].questionMarked) {
        // If the square is question marked when placing a flag, remove questionMarked
        squares[squareKey].questionMarked = !squares[squareKey].questionMarked;
      }
    } else if (questionMode) {
      // If placing a question mark is active, then mark only that square and then save to state
      squares[squareKey].questionMarked = !squares[squareKey].questionMarked;
      if (squares[squareKey].questionMarked) {
        // If a question mark is placed, increment the question mark count
        stats.questions++;
        this.setState({ stats })
      } else {
        // If a question mark is removed, decrement the question mark count
        stats.questions--;
        this.setState({ stats })
      }
      if (squares[squareKey].flagged) {
        // If the square is flagged when placing a question mark, unflag it
        squares[squareKey].flagged = !squares[squareKey].flagged;
      }
    } else {
      // Mark as clicked and evaluate
      squares[squareKey].clicked = true;
      // let stats = {...this.state.stats};
      if (!bomb) {
        // Increment revealed
        stats.revealed++;
        // Check neighbors to determine whether to click them or show their hint. Those with hints CAN be bombs
        stats = this.checkNeighbors(squareKey, squares, stats);
        this.setState({ stats });
        if (adjacentBombCount > 0) {
          // Click on a square with an adjacent bomb, reveal its hint
          squares[squareKey].hint = true;
        }
        // Handle Win
        if (stats.revealed === stats.totalToReveal) {
          gameState.progress = 1;
          notices.victoryNotice = true;
          const squares = { ...this.state.squares };
          const animations = {...this.state.animations}
          const modal = {...this.state.modal}
          animations.bombFade = true;
          if (!modal.isVisible) {
          // Handle displaying the play again modal upon win
            if (!modal.timer) {
              modal.timer = true;
              this.setState({modal});
              setTimeout(() => {
                this.modalShow();
                const modal = {...this.state.modal};
                modal.modalCleanup = true;
                this.setState({modal});
              }, 3500);
            }
          }
          this.setState({gameState, notices, animations, modal});
          Object.keys(squares).map(key => {
            if (!squares[key].clicked) {
              // Reveal the board
              squares[key].clicked = true;
            }
            return squares;
          })
        }
      } else {
        // Clicked on a bomb
        const notices: noticesType = {...this.state.notices};
        const modes: modesType = {...this.state.modes};
        const stats: statsType = {...this.state.stats};
        stats.currentLives--;
        modes.bombMode = true;
        if (!(stats.currentLives < 0)) {
          // If currentLives is >= 0, show bomb notice
          notices.bombNotice = true;
        }
        squares[squareKey].explosion.explodeTrigger = true;
        this.setState({squares, notices, modes, stats})
        // Handle defeat
        if (stats.currentLives < 0) {
          // Flag gamestate as defeat
          gameState.progress = -1;
          // Show the you lost all lives notice
          notices.defeatNotice = true;
          Object.keys(squares).map(key => {
            if (!squares[key].clicked) {
              // Reveal the board when you lose
              squares[key].clicked = true;
              if (squares[key].bomb) {
                // Trigger all bombs to play their explosion animation
                squares[key].explosion.explodeTrigger = true;
              }
            }
            return squares;
          })
          this.setState({squares, gameState, notices});
        }
      }
    }
    // 3. Save state
    this.setState({ squares });
  }

  // Called by this.onSquareClick() to determine whether a square's neighbors are bombs or have adjacent bombs
  protected checkNeighbors = (squareKey, squares, stats) => {
    let neighbors: Array<string>;
    if ((squares[squareKey].neighbors === 'undefined' || squares[squareKey].neighbors.length === 0) || squares[squareKey].adjacentBombCount === -1 ) {
      // If squareKey has no neighbors or its adjacent bombs have not been counted, then call countAdjacentBombs
      neighbors = this.countAdjacentBombs(squareKey);
    } else {
      neighbors = squares[squareKey].neighbors;
    }
    neighbors.forEach(neighbor => {
      if ((squares[neighbor].neighbors === 'undefined' || squares[neighbor].neighbors.length === 0) || squares[neighbor].adjacentBombCount === -1 ) {
        this.countAdjacentBombs(neighbor);
      }
      if (squares[neighbor].adjacentBombCount > 0 && !squares[neighbor].clicked && !squares[neighbor].hint) {
        // If a neighbor has an adjacent bomb, hasn't been clicked or had its hint revealed, then reveal its hint
        squares[neighbor].hint = true;
      } else if (squares[neighbor].adjacentBombCount === 0 && !squares[neighbor].bomb && !squares[neighbor].clicked && !squares[neighbor].hint) {
        // If a neighbor has no adjacent bombs, isn't a bomb, has no revealed hint or been clicked, then mark as clicked and check its neighbors
        squares[neighbor].clicked = true;
        // Increment revealed
        stats.revealed++;
        this.checkNeighbors(neighbor, squares, stats);
      }
    })
    return stats;
  }

  // Called by this.checkNeighbors() to determine who is a neighbor of a square and tally that square's adjacent bomb count
  countAdjacentBombs = squareKey => {
    const size = this.state.gameState.options.size;
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

  /* Modal fn's */

  protected modalShow = () => {
    const modal: modalType = {...this.state.modal};
    if (!modal.isVisible) {
      modal.isVisible = true
      this.setState({modal});
      return modal.isVisible;
    }
    return;
  }

  protected modalClose = () => {
    const modal: modalType = {...this.state.modal};
    if (modal.isVisible) {
      modal.isVisible = false
      this.setState({modal});
      return modal.isVisible;
    }
    return;
  }

  protected modalGameStateMessage = () => {
    const gameState: gameStateType = {...this.state.gameState};
    if (gameState.progress === 1) {
      // Win message
      return "Congrats, You Won!";
    } else if ( gameState.progress === -1) {
      // Defeat message
      return "You Lost!";
    }
    return "Customize Settings";
  }

  protected modalSettingsButtonText = () => {
    const gameState: gameStateType = {...this.state.gameState};
    const modal: modalType = {...this.state.modal}
    if (gameState.progress !== 0 && modal.modalCleanup) {
      return "Play Again?";
    }
    return "Customize Settings";

  }

  protected renderModal = () => {
    const modal: modalType = {...this.state.modal};
    if (modal.isVisible) {
      return (
        <div>

          <Modal
            show={this.state.modal.isVisible}
            onHide={this.modalClose} // Handles closing modal on ESC or clicking on overlay
          >
            <Modal.Header>
              <h3>{this.modalGameStateMessage()}</h3>
            </Modal.Header>
            <Modal.Body>
              <Form
                modalClose={this.modalClose}
                options={this.state.gameState.options}
                saveOptions={this.saveOptions}
                initSquares={this.initSquares}
                data={this.state.data}
                gameState={this.state.gameState}
              />
            </Modal.Body>
          </Modal>
        </div>
      )
    }
    return;
  }

  render() {
    const columns = [];
    let columnKey;
    for (let i = 0; i < this.state.gameState.options.size; i++) {
      columnKey = `s${i}`;
      columns.push(
        <Column
          key={columnKey}
          columnKey={columnKey}
          modes={this.state.modes}
          animations={this.state.animations}
          squares={this.state.squares}
          size={this.state.gameState.options.size}
          onSquareClick={this.onSquareClick}
          toggleScroll={this.toggleScroll}
          explode={this.explode}
          gameState={this.state.gameState}
        />
      )
    }

    return (
      <div>
        <Header />
        <div className="game-board container">

          <div>
            {this.renderModal()}
          </div>
          <div className="game-body row">
            <div className="col-3">
              <button className="btn btn-secondary buttons" onClick={this.modalShow}>{this.modalSettingsButtonText()}</button>
              <Notice notices={this.state.notices} />
              <Stats
                stats={this.state.stats}
                options={this.state.gameState.options}
                revealTarget={this.revealTarget}
              />
              <div className="modes">
                <Flag onModeClick={this.onModeClick} modes={this.state.modes} gameState={this.state.gameState}/>
                <QuestionMark onModeClick={this.onModeClick} modes={this.state.modes} gameState={this.state.gameState}/>
              </div>
            </div>
            <div className="col-9">

              <div className="squares">
                {columns}
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default App;
