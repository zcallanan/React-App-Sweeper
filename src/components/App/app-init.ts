import { AppState, CustomGameValues, SquareDataType } from "../../types";
import { randomIntFromInterval } from "../../helpers";

const dataInit: CustomGameValues = {
  bombPercentage: {
    0: "10%",
    1: "20%",
    2: "30%",
    3: "45%",
    4: "60%",
    5: "75%",
  },
  numberOfLives: {
    0: "0",
    1: "1",
    2: "2",
    3: "5",
    4: "9",
    5: "99",
  },
};

const squareInit: SquareDataType = {
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
    explodeFire: false,
  },
};

const appInit: AppState = {
  gameState: {
    optionsSet: false,
    initialized: false, // Prevents calling initSquares during a game
    lastClicked: "",
    clickHistory: [], // Every square revealed during a game
    bombPositions: [], // Where bombs are hidden
    bombPositionsAssigned: false,
    gameReset: false, // Toggled when a form submits (saveOptions) a game reset
    squaresComplete: false, // Toggled when squares are saved with default data
    squaresPruned: false,
    progress: 0, // -1 defeat, 0 mid-game, 1 victory
    options: {
      // User input settings, loaded from localStorage if available
      size: -1,
      difficulty: -1,
      lives: -1,
    },
  },
  data: dataInit,
  squares: {
    "r0-s0": squareInit,
  },
  modes: {
    newGame: false, // Denotes the start of a new game before a square is selected
    bombMode: false, // Struck a bomb, locks input
    flagMode: false, // Place a flag on a square
    questionMode: false, // Place a question mark on a square
    drawing: true, // On square init the initial board draws. After 1.5 seconds this is marked false
  },
  gameStats: {
    currentLives: -1,
    bombs: -1,
    revealed: 0,
    totalToReveal: 0,
    flags: 0,
    questions: 0,
  },
  notices: {
    bombNotice: false,
    victoryNotice: false,
    defeatNotice: false,
  },
  animations: {
    squareScroll: false,
    seed: randomIntFromInterval(1, 9999),
    bombFade: false,
  },
  modal: {
    isVisible: false, // Is the modal visible?
    timer: false, // Prevents multiple timers from starting in order to show a modal on win/loss
    modalCleanup: false,
  },
};

export { appInit, dataInit, squareInit };
