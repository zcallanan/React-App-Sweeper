import { appInit } from "./app-init";
import { AppAction, AppState } from "../../types";

const appReducer = (state: typeof appInit, action: AppAction): AppState => {
  switch (action.type) {
    case "GAME_INIT":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          progress: action.payload.progress,
          options: {
            size: action.payload.options.size,
            difficulty: action.payload.options.difficulty,
            lives: action.payload.options.lives,
          },
        },
        modes: {
          ...state.modes,
          newGame: action.payload.newGame,
        },
        gameStats: {
          ...state.gameStats,
          currentLives: action.payload.currentLives,
        },
      };
    case "SQUARES_INITIALIZED":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          initialized: action.payload.initialized,
        },
      };
    case "TOGGLE_NEWGAME":
      return {
        ...state,
        modes: {
          ...state.modes,
          newGame: action.payload.newGame,
        },
      };
    case "GAMESTATE_SET_PROGRESS":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          progress: action.payload.progress,
        },
      };
    case "MODES_GAMEBOARD_DRAWING":
      return {
        ...state,
        modes: {
          ...state.modes,
          drawing: action.payload.drawing,
        },
      };
    case "SET_FLAG_QUESTION":
      return {
        ...state,
        modes: {
          ...state.modes,
          flagMode: action.payload.flagMode,
          questionMode: action.payload.questionMode,
        },
      };
    case "GAMESTATS_SET_BOMB_COUNT":
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          bombs: action.payload.bombCount,
        },
      };
    case "GAMESTATS_UPDATE_TOTALTOREVEAL":
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          totalToReveal: action.payload.totalToReveal,
        },
      };
    case "SQUARES_REVEALED":
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          revealed: action.payload.revealed,
        },
      };
    case "BOMB_NOTICE":
      return {
        ...state,
        notices: {
          ...state.notices,
          bombNotice: action.payload.bombNotice,
        },
      };
    case "BOMB_CLICKED":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            explosion: {
              ...state.squares[action.key].explosion,
              explodeTrigger: action.payload.explodeTrigger,
            },
          },
        },
        gameStats: {
          ...state.gameStats,
          currentLives: action.payload.currentLives,
        },
        modes: {
          ...state.modes,
          bombMode: action.payload.bombMode,
        },
      };
    case "GAME_RESET_CLEANUP":
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          bombs: action.payload.bombs,
          revealed: action.payload.revealed,
          flags: action.payload.flags,
          questions: action.payload.questions,
        },
        animations: {
          ...state.animations,
          bombFade: action.payload.bombFade,
          seed: action.payload.seed,
        },
        gameState: {
          ...state.gameState,
          clickHistory: action.payload.clickHistory,
          bombPositions: action.payload.bombPositions,
          squaresComplete: action.payload.squaresComplete,
          squaresPruned: action.payload.squaresPruned,
          bombPositionsAssigned: action.payload.bombPositionsAssigned,
        },
        modal: {
          ...state.modal,
          isVisible: action.payload.isVisible,
          timer: action.payload.timer,
          modalCleanup: action.payload.modalCleanup,
        },
        notices: {
          bombNotice: action.payload.bombNotice,
          victoryNotice: action.payload.victoryNotice,
          defeatNotice: action.payload.defeatNotice,
        },
      };
    case "FORM_TOGGLE_SQUARESCROLL":
      return {
        ...state,
        animations: {
          ...state.animations,
          squareScroll: action.payload.squareScroll,
        },
      };
    case "VICTORY_SET":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          progress: action.payload.progress,
        },
        animations: {
          ...state.animations,
          bombFade: action.payload.bombFade,
        },
        notices: {
          ...state.notices,
          victoryNotice: action.payload.victoryNotice,
        },
      };
    case "SQUARES_ADD": {
      const stateD = { ...state };
      stateD.squares[action.key] = action.payload;
      return stateD;
    }
    case "SQUARES_DELETE": {
      const stateA = { ...state };
      delete stateA.squares[action.key];
      return stateA;
    }
    case "SQUARES_BOMB": {
      const stateB = { ...state };
      stateB.gameState.bombPositions.push(action.key);
      stateB.squares[action.key].bomb = action.payload.bomb;
      return stateB;
    }
    case "EXPLODE_TRIGGER":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            explosion: {
              ...state.squares[action.key].explosion,
              explodeTrigger: action.payload.explodeTrigger,
            },
          },
        },
      };
    case "EXPLODE_TIMER":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            explosion: {
              ...state.squares[action.key].explosion,
              explodeTimer: action.payload.explodeTimer,
            },
          },
        },
      };
    case "SQUARES_NOTICES_CLEANUP":
      return {
        ...state,
        notices: {
          ...state.notices,
          bombNotice: action.payload.bombNotice,
        },
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            explosion: {
              ...state.squares[action.key].explosion,
              explodeCleanup: action.payload.explodeCleanup,
              explodeTrigger: action.payload.explodeTrigger,
              explodeTimer: action.payload.explodeTimer,
            },
          },
        },
      };
    case "REMOVE_CLICK_BOMBMODE":
      return {
        ...state,
        modes: {
          ...state.modes,
          bombMode: action.payload.bombMode,
        },
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            clicked: action.payload.clicked,
          },
        },
      };
    case "DEFEAT_EXPLODE_BOMB":
      return {
        ...state,
        modes: {
          ...state.modes,
          bombMode: action.payload.bombMode,
        },
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            explosion: {
              ...state.squares[action.key].explosion,
              explodeTrigger: action.payload.explodeTrigger,
              explodeFire: action.payload.explodeFire,
            },
          },
        },
      };
    case "EXPLODE_FIRE":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            explosion: {
              ...state.squares[action.key].explosion,
              explodeFire: action.payload.explodeFire,
            },
          },
        },
      };
    case "SQUARE_HINT":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            hint: action.payload.hint,
          },
        },
      };
    case "SQUARE_CLICKED":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            clicked: action.payload.clicked,
          },
        },
      };
    case "SQUARE_NEIGHBORS":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            neighbors: action.payload.neighbors,
            adjacentBombCount: action.payload.adjacentBombCount,
          },
        },
      };
    case "MODAL_TIMER":
      return {
        ...state,
        modal: {
          ...state.modal,
          timer: action.payload.timer,
        },
      };
    case "MODAL_CLEANUP":
      return {
        ...state,
        modal: {
          ...state.modal,
          modalCleanup: action.payload.modalCleanup,
        },
      };
    case "MODAL_VISIBILITY":
      return {
        ...state,
        modal: {
          ...state.modal,
          isVisible: action.payload.isVisible,
        },
      };
    case "FLAGGED_FLAG_COUNT":
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          flags: action.payload.flags,
        },
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            flagged: action.payload.flagged,
          },
        },
      };
    case "QUESTIONMARKED_QS_COUNT":
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          questions: action.payload.questions,
        },
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            questionMarked: action.payload.questionMarked,
          },
        },
      };
    case "FLAGGED":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            flagged: action.payload.flagged,
          },
        },
      };
    case "QUESTIONMARKED":
      return {
        ...state,
        squares: {
          ...state.squares,
          [action.key]: {
            ...state.squares[action.key],
            questionMarked: action.payload.questionMarked,
          },
        },
      };
    case "DEFEAT_NOTICE":
      return {
        ...state,
        notices: {
          ...state.notices,
          defeatNotice: action.payload.defeatNotice,
        },
        gameState: {
          ...state.gameState,
          progress: action.payload.progress,
        },
      };
    case "GAME_RESET":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          gameReset: action.payload.gameReset,
        },
      };
    case "PUSH_CLICK_HISTORY": {
      const stateC = { ...state };
      stateC.gameState.clickHistory.push(action.payload.key);
      return stateC;
    }
    case "SQUARES_INIT_COMPLETE":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          squaresComplete: action.payload.squaresComplete,
        },
      };
    case "BOMB_POSITIONS_ASSIGNED":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          bombPositionsAssigned: action.payload.bombPositionsAssigned,
        },
      };
    case "SQUARES_PRUNED":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          squaresPruned: action.payload.squaresPruned,
        },
      };
    // Default
    default:
      throw new Error();
  }
};

export default appReducer;
