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

/* ************************************
  App Action Payload Types (Reducers)
************************************ */

type GameInit = {
  progress: number;
  options: SizeDifficultyLives;
  currentLives: number;
  newGame: boolean;
};

type FormInit = {
  seed: number,
  bombFade: boolean,
  isVisible: boolean,
  timer: boolean,
  modalCleanup: boolean,
};

type Progress = {
  progress: number;
};

type CurrentLives = {
  currentLives: number;
};

type GStatsNoticesCleanup = {
  revealed: number;
  flags: number;
  questions: number;
  bombNotice: boolean;
  victoryNotice: boolean;
  defeatNotice: boolean;
};

type TotalToReveal = {
  totalToReveal: number;
};

type BombCount = {
  bombs: number;
};

type NewGame = {
  newGame: boolean;
}

type Drawing = {
  drawing: boolean;
}

type FormReset = {
  seed: number;
  bombFade: boolean;
};

type Bomb = {
  bomb: boolean;
};

type ModeToggle = {
  flagMode: boolean;
  questionMode: boolean;
}

type ExplodeTrigger = {
  explodeTrigger: boolean;
};

type ExplodeTimer = {
  explodeTimer: boolean;
};

type ExplodePartial = {
  explodeCleanup: boolean;
  explodeTrigger: boolean;
};

type SquaresNoticesCleanup = {
  explodeCleanup: boolean;
  explodeTrigger: boolean;
  explodeTimer: boolean;
  bombNotice: boolean;
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

export type AppAction = { type: "GAME_INIT"; payload: GameInit }
  | { type: "FORM_INIT"; payload: FormInit }
  | { type: "GAMESTATE_SET_PROGRESS"; payload: Progress }
  | { type: "MODES_GAMEBOARD_DRAWING"; payload: Drawing }
  | { type: "SET_FLAG_QUESTION"; payload: ModeToggle }
  | { type: "GAMESTATS_SET_BOMB_COUNT"; payload: BombCount  }
  | { type: "GAMESTATS_NOTICES_CLEANUP"; payload: GStatsNoticesCleanup }
  | { type: "GAMESTATS_UPDATE_TOTALTOREVEAL"; payload: TotalToReveal }
  | { type: "FORM_TOGGLE_SQUARESCROLL"; payload: DictBool }
  | { type: "SQUARES_ADD"; key: string; payload: SquareDataType }
  | { type: "SQUARES_DELETE"; key: string; }
  | { type: "SQUARES_BOMB"; key: string; payload: Bomb }
  | { type: "SQUARES_TOGGLE_EXPLODE_TRIGGER"; key: string; payload: ExplodeTrigger }
  | { type: "SQUARES_TOGGLE_EXPLODE_TIMER"; key: string; payload: ExplodeTimer }
  | { type: "SQUARES_EXPLODE_PARTIAL_RESET"; key: string; payload: ExplodePartial }
  | { type: "SQUARES_NOTICES_CLEANUP"; key: string; payload: SquaresNoticesCleanup }


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
