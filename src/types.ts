// Dicts
export type DictNumber = {
  [key: string]: number;
};

export type DictBool = {
  [key:string]: boolean;
};

export type DictString = {
  [key: string]: string;
};

// App State
export type AppState = {
  gameState : GameState;
  data: CustomGameValues;
  squares: SquaresType;
  modes: ModesType;
  gameStats: GameStats;
  notices: Notices;
  animations: AnimationsType;
  modal: ModalType;
};

// GameState data
export type GameState = {
  progress: number;
  options: SizeDifficultyLives;
};

export type SizeDifficultyLives = {
  size: number;
  difficulty: number;
  lives: number;
};

// Hardcoded custom game data
export type CustomGameValues = {
  bombPercentage: DictString;
  numberOfLives: DictString;
};

// Modal state data
export type ModalType = {
  isVisible: boolean;
  timer: boolean;
  modalCleanup: boolean;
};

// Game stats state data
export type GameStats = {
  currentLives: number;
  bombs: number;
  revealed: number;
  totalToReveal: number;
  flags: number;
  questions: number;
};

// Game notices state data
export type Notices = {
  bombNotice: boolean;
  victoryNotice: boolean;
  defeatNotice: boolean;
};

// Game modes state data
export type ModesType = {
  newGame: boolean;
  bombMode: boolean;
  flagMode: boolean;
  questionMode: boolean;
  drawing: boolean;
};

// Square state data
export type SquaresType = {
  [key: string]: SquareDataType;
};

export type SquareDataType = {
  bomb: boolean;
  flagged: boolean;
  questionMarked: boolean;
  clicked: boolean;
  hint: boolean;
  neighbors: string[];
  adjacentBombCount: number;
  explosion: ExplosionType;
};

export type ExplosionType = {
  explodeTrigger: boolean;
  explodeTimer: boolean;
  explodeCleanup: boolean;
  explodeFire: boolean;
};

// Square animations data
export type AnimationsType = {
  squareScroll: boolean;
  seed: number;
  bombFade: boolean;
};

/* *****************************
  App Payload Types (Reducers)
***************************** */

// GAMESTATE Payloads
type GameStateAllPd = {
  gameState: GameState;
}

type GameStateProgPd = {
  gameState: ProgressProp;
}

// GameState Properties

type ProgressProp = {
  progress: number;
};

/*
  GAMESTATS Payloads
*/

type GameStatsLivesPd = {
  gameStats: LivesProp;
};

type GStatsCleanupPd = {
  gameStats: GStatsCleanupProps;
};

type GStatsUpdateTotalToRevealPd = {
  gameStats: GStatsUpdateTotalToRevealProp;
};

// GAMESTATS Properties

type LivesProp = {
  currentLives: number;
};

type GStatsCleanupProps = {
  revealed: number;
  flags: number;
  questions: number;
};

type GStatsUpdateTotalToRevealProp = {
  totalToReveal: number;
};

/*
  MODES Payloads
*/

type ModesLivesPd = {
  modes: NewGameProp;
}

type ModesDrawingPd = {
  modes: DrawingProp;
}

// MODES Properties

type NewGameProp = {
  newGame: boolean;
}

type DrawingProp = {
  drawing: boolean;
}

/*
  ANIMATIONS Payloads
*/

type FormResetPd = {
  animations: FormResetProps;
};

type FormToggleSqScrollPd = {
  animations: FormToggleSqScrollProp;
};

// ANIMATIONS Properties

type FormResetProps = {
  seed: number;
  bombFade: boolean;
};

type FormToggleSqScrollProp = {
  squareScroll: boolean;
};

/*
  MODALS Payloads
*/

type ModalClosePd = {
  modal: ModalType;
};

// MODALS Properties


/*
  NOTICES Payloads
*/

type NoticesCleanupPd = {
  notices: Notices
};

// NOTICES Properties

/*
  SQUARES Payloads
*/

type SquaresAddPd = {
  squareValue: SquareDataType
};


/* ***********************************
  Component Payload Types (Reducers)
*********************************** */

export type FormPd = {
  size: number,
  difficulty: number,
  lives: number,
  errorString: string,
};

export type SquarePd = {
  bombAnimIsPlaying: boolean;
  fireAnimIsPlaying: boolean;
};

export type StatsPd = {
  size: number;
  bombs: number;
  totalToReveal: number;
};








/* ************************
  Action Types (Reducers)
************************ */

export type AppAction = { type: "GAMESTATE_INIT"; payload: GameStateAllPd }
  | { type: "GAMESTATE_SET_PROGRESS"; payload: GameStateProgPd }
  | { type: "MODES_NEWGAME"; payload: ModesLivesPd }
  | { type: "MODES_GAMEBOARD_DRAWING"; payload: ModesDrawingPd }
  | { type: "GAMESTATS_STARTING_LIVES"; payload: GameStatsLivesPd }
  | { type: "GAMESTATS_CLEANUP"; payload: GStatsCleanupPd }
  | { type: "GAMESTATS_UPDATE_TOTALTOREVEAL"; payload: GStatsUpdateTotalToRevealPd }
  | { type: "FORM_RESET"; payload: FormResetPd }
  | { type: "FORM_TOGGLE_SQUARESCROLL"; payload: FormToggleSqScrollPd }
  | { type: "MODAL_CLOSE"; payload: ModalClosePd }
  | { type: "NOTICES_CLEANUP"; payload: NoticesCleanupPd }
  | { type: "SQUARES_ADD"; key: string; payload: SquaresAddPd }
  | { type: "SQUARES_DELETE"; key: string; }

export type FormAction = { type: "FORM_INIT_VALUES"; payload: SizeDifficultyLives }
  | { type: "FORM_SET_SIZE"; payload: DictNumber }
  | { type: "FORM_SET_DIFFICULTY"; payload: DictNumber }
  | { type: "FORM_SET_LIVES"; payload: DictNumber }
  | { type: "FORM_SET_ERROR"; payload: DictString };

export type SquareAction = { type: "SQUARE_ALL_VALUES"; payload: SquarePd }
  | { type: "SQUARE_SET_BOMB_ANIM"; payload: DictBool }
  | { type: "SQUARE_SET_FIRE_ANIM"; payload: DictBool };

export type StatsAction = { type: "STATS_INIT_VALUES"; payload: StatsPd }
  | { type: "STATS_SET_SIZE"; payload: DictNumber }
  | { type: "STATS_SET_BOMBS"; payload: DictNumber }
  | { type: "STATS_SET_TOTALTOREVEAL"; payload: DictNumber };

/* ***********
  Prop Types
*********** */

export type SquareProps = {
  animations: AnimationsType;
  gameState: GameState;
  modes: ModesType;
  squareData: SquareDataType;
  squareKey: string;
  explode: (squareKey: string) => void;
  onSquareClick: (squareKey: string) => void;
  toggleScroll: (bool: boolean, anim: string) => void;
  explosion: ExplosionType;
};

export type StatsProps = {
  stats: GameStats;
  options: SizeDifficultyLives;
  revealTarget: (totalToReveal: number) => void;
};

export type QuestionProps = {
  modes: ModesType;
  gameState: GameState;
  onModeClick(e: React.FormEvent<HTMLFormElement>): void;
};

export type NoticesProps = {
  notices: Notices;
};

export type FormProps = {
  gameState: GameState;
  data: CustomGameValues;
  options: SizeDifficultyLives;
  modalClose: () => void;
  initSquares: (size: number) => void;
  saveOptions: (obj: SizeDifficultyLives) => void;
};

export type FlagProps = {
  modes: ModesType;
  gameState: GameState;
  onModeClick(e: React.FormEvent<HTMLFormElement>): void;
};

export type ColumnProps = {
  columnKey: string;
  animations: AnimationsType;
  gameState: GameState;
  modes: ModesType;
  squares: object;
  size: number;
  explode: (squareKey: string) => void;
  onSquareClick: (squareKey: string) => void;
  toggleScroll: (bool: boolean, anim: string) => void;
};
