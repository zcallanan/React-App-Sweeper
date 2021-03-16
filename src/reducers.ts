import { randomIntFromInterval } from "./helpers";
import {
  FormPd,
  SquarePd,
  StatsPd,
  FormAction,
  SquareAction,
  StatsAction,
  AppState,
  AppAction,
  CustomGameValues,
} from './types';

/* *****************
  Form Init Values
***************** */

export const formInit: FormPd = {
  size: -1,
  difficulty: -1,
  lives: -1,
  errorString: "",
}

/* *******************
  Square Init Values
******************* */

export const squareInit: SquarePd = {
  bombAnimIsPlaying: false,
  fireAnimIsPlaying: false,
};

/* ******************
  Stats Init Values
****************** */

export const statsInit: StatsPd = {
  size: -1,
  bombs: -1,
  totalToReveal: -1,
};

/* ****************
  App Init Values
**************** */

export const dataInit: CustomGameValues = {
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

export const appInit: AppState = {
  gameState : {
    progress: 0, // -1 defeat, 0 mid-game, 1 victory
    options: {
      // User input settings, loaded from localStorage if available
      size: 0,
      difficulty: 0,
      lives: 0,
    },
  },
  data: dataInit,
  squares: {
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
        explodeFire: false,
      },
    },
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
    timer: false, // Prevents multiple timers from starting in order to show a delayed modal on win/loss
    modalCleanup: false,
   },
};

/* *************
  Form Reducer
************* */

export const formReducer = (state: typeof formInit, action: FormAction) => {
  switch (action.type) {
    case "FORM_INIT_VALUES":
      return {
        ...state,
        size: action.payload.size,
        difficulty: action.payload.difficulty,
        lives: action.payload.lives,
      };
    case "FORM_SET_SIZE":
    return {
      ...state,
      size: action.payload.size,
    };
    case "FORM_SET_DIFFICULTY":
    return {
      ...state,
      difficulty: action.payload.difficulty,
    };
    case "FORM_SET_LIVES":
    return {
      ...state,
      lives: action.payload.lives,
    };
    case "FORM_SET_ERROR":
    return {
      ...state,
      errorString: action.payload.errorString,
    };
    default:
      throw new Error();
  }
};

/* ***************
  Square Reducer
*************** */

export const squareReducer = (state: typeof squareInit, action: SquareAction) => {
  switch (action.type) {
    case "SQUARE_ALL_VALUES":
      return {
        bombAnimIsPlaying: action.payload.bombAnimIsPlaying,
        fireAnimIsPlaying: action.payload.fireAnimIsPlaying,
      };
    case "SQUARE_SET_BOMB_ANIM":
    return {
      ...state,
      size: action.payload.bombAnimIsPlaying,
    };
    case "SQUARE_SET_FIRE_ANIM":
    return {
      ...state,
      bombs: action.payload.fireAnimIsPlaying,
    };
    default:
      throw new Error();
  }
};

/* **************
  Stats Reducer
************** */

export const statsReducer = (state: typeof statsInit, action: StatsAction) => {
  switch (action.type) {
    case "STATS_INIT_VALUES":
      return {
        size: action.payload.size,
        bombs: action.payload.bombs,
        totalToReveal: action.payload.totalToReveal,
      };
    case "STATS_SET_SIZE":
    return {
      ...state,
      size: action.payload.size,
    };
    case "STATS_SET_BOMBS":
    return {
      ...state,
      bombs: action.payload.bombs,
    };
    case "STATS_SET_TOTALTOREVEAL":
    return {
      ...state,
      totalToReveal: action.payload.totalToReveal,
    };
    default:
      throw new Error();
  }
};

/* ************
  App Reducer
************ */

export const appReducer = (state: typeof appInit, action: AppAction) => {
  switch (action.type) {
    case "GAMESTATE_INIT":
    return {
      ...state,
      gameState: {
        progress: action.payload.progress,
        options: {
          size: action.payload.options.size,
          difficulty: action.payload.options.difficulty,
          lives: action.payload.options.lives,
        },
      }
    };
    case "GAMESTATE_SET_PROGRESS":
    return {
      ...state,
      gameState: {
        ...state.gameState,
        progress: action.payload.progress,
      }
    };
    case "MODES_NEWGAME":
    return {
      ...state,
      modes: {
        ...state.modes,
        newGame: action.payload.newGame,
      }
    };
    case "MODES_GAMEBOARD_DRAWING":
    return {
      ...state,
      modes: {
        ...state.modes,
        drawing: action.payload.drawing,
      }
    };
    case "GAMESTATS_CLEANUP":
    return {
      ...state,
      gameStats: {
        ...state.gameStats,
        revealed: action.payload.revealed,
        flags: action.payload.flags,
        questions: action.payload.questions,
      }
    }
    case "GAMESTATS_STARTING_LIVES":
    return {
      ...state,
      gameStats: {
        ...state.gameStats,
        currentLives: action.payload.currentLives,
      }
    };
    case "GAMESTATS_SET_BOMB_COUNT":
    return {
      ...state,
      gameStats: {
        ...state.gameStats,
        bombs: action.payload.bombs,
      }
    };
    case "GAMESTATS_UPDATE_TOTALTOREVEAL":
    return {
      ...state,
      gameStats: {
        ...state.gameStats,
        totalToReveal: action.payload.totalToReveal,
      }
    };
    case "FORM_RESET":
    return {
      ...state,
      animations: {
        ...state.animations,
        bombFade: action.payload.bombFade,
        seed: action.payload.seed,
      }
    };
    case "FORM_TOGGLE_SQUARESCROLL":
    return {
      ...state,
      animations: {
        ...state.animations,
        squareScroll: action.payload.squareScroll,
      }
    };
    case "MODAL_CLOSE":
    return {
      ...state,
      modal: {
        ...state.modal,
        isVisible: action.payload.isVisible,
        timer: action.payload.timer,
        modalCleanup: action.payload.modalCleanup,
      }
    };
    case "NOTICES_CLEANUP":
    return {
      ...state,
      notices: {
        ...state.notices,
        bombNotice: action.payload.bombNotice,
        victoryNotice: action.payload.victoryNotice,
        defeatNotice: action.payload.defeatNotice,
      }
    };
    case "SQUARES_ADD":
    return {
      ...state,
      squares: {
        ...state.squares,
        [action.key]: action.payload,
      }
    };
    case "SQUARES_DELETE":
    const stateCopy = {
      ...state,
    };
    delete stateCopy.squares[action.key];
    return stateCopy;
    case "SQUARES_BOMB":
    return {
      ...state,
      squares: {
        ...state.squares,
        [action.key]: {
          ...state.squares[action.key],
          bomb: action.payload.bomb,
        }
      }
    };
    default:
      throw new Error();
  }
};
