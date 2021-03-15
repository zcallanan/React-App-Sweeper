import {
  FormPayload,
  SquarePayload,
  StatsPayload,
  FormAction,
  SquareAction,
  StatsAction,
} from './types';

// Initial values
export const formInit: FormPayload = {
  size: -1,
  difficulty: -1,
  lives: -1,
  errorString: "",
}

export const squareInit: SquarePayload = {
  bombAnimIsPlaying: false,
  fireAnimIsPlaying: false,
};

export const statsInit: StatsPayload = {
  size: -1,
  bombs: -1,
  totalToReveal: -1,
};

// Reducers
export const formReducer = (state: typeof formInit, action: FormAction) => {
  switch (action.type) {
    case "InitValues":
      return {
        ...state,
        size: action.payload.size,
        difficulty: action.payload.difficulty,
        lives: action.payload.lives,
      };
    case "SetSize":
    return {
      ...state,
      size: action.payload.size,
    };
    case "SetDifficulty":
    return {
      ...state,
      difficulty: action.payload.difficulty,
    };
    case "SetLives":
    return {
      ...state,
      lives: action.payload.lives,
    };
    case "SetError":
    return {
      ...state,
      errorString: action.payload.errorString,
    };
    default:
      throw new Error();
  }
};

export const squareReducer = (state: typeof squareInit, action: SquareAction) => {
  switch (action.type) {
    case "AllValues":
      return {
        bombAnimIsPlaying: action.payload.bombAnimIsPlaying,
        fireAnimIsPlaying: action.payload.fireAnimIsPlaying,
      };
    case "SetBombAnim":
    return {
      ...state,
      size: action.payload.bombAnimIsPlaying,
    };
    case "SetFireAnim":
    return {
      ...state,
      bombs: action.payload.fireAnimIsPlaying,
    };
    default:
      throw new Error();
  }
};

export const statsReducer = (state: typeof statsInit, action: StatsAction) => {
  switch (action.type) {
    case "InitValues":
      return {
        size: action.payload.size,
        bombs: action.payload.bombs,
        totalToReveal: action.payload.totalToReveal,
      };
    case "SetSize":
    return {
      ...state,
      size: action.payload.size,
    };
    case "SetBombs":
    return {
      ...state,
      bombs: action.payload.bombs,
    };
    case "SetTotalToReveal":
    return {
      ...state,
      totalToReveal: action.payload.totalToReveal,
    };
    default:
      throw new Error();
  }
};
