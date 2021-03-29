// Dicts
export type DictNumber = {
  [key: string]: number;
};

export type DictBool = {
  [key: string]: boolean;
};

export type DictString = {
  [key: string]: string;
};

// App State
export type AppState = {
  gameState: GameState;
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
  optionsSet: boolean;
  initialized: boolean;
  lastClicked: string;
  clickHistory: string[];
  bombPositions: string[];
  gameReset: boolean;
  squaresPruned: boolean;
  squaresComplete: boolean;
  bombPositionsAssigned: boolean;
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

export type Disabled = {
  disabled: string;
};

// Square animations data
export type AnimationsType = {
  squareScroll: boolean;
  seed: number;
  bombFade: boolean;
};

export type KeyMessage = {
  key: string;
  message: string;
};

/* ************************************
  App Action Payload Types (Reducers)
************************************ */

type GameInit = {
  optionsSet: boolean;
  progress: number;
  options: SizeDifficultyLives;
  currentLives: number;
  newGame: boolean;
};

type GameResetCleanup = {
  seed: number;
  bombs: number;
  clickHistory: string[];
  bombPositions: string[];
  lastClicked: string;
  bombPositionsAssigned: boolean;
  squaresComplete: boolean;
  squaresPruned: boolean;
  bombFade: boolean;
  isVisible: boolean;
  timer: boolean;
  modalCleanup: boolean;
  revealed: number;
  flags: number;
  questions: number;
  bombNotice: boolean;
  victoryNotice: boolean;
  defeatNotice: boolean;
};

type Progress = {
  progress: number;
};

type TotalToReveal = {
  totalToReveal: number;
};

type BombCount = {
  bombCount: number;
};

type NewGame = {
  newGame: boolean;
};

type Drawing = {
  drawing: boolean;
};

type Bomb = {
  bomb: boolean;
};

type ModeToggle = {
  flagMode: boolean;
  questionMode: boolean;
};

type ExplodeTrigger = {
  explodeTrigger: boolean;
};

type ExplodeTimer = {
  explodeTimer: boolean;
};

type SquaresNoticesCleanup = {
  explodeCleanup: boolean;
  explodeTrigger: boolean;
  explodeTimer: boolean;
  bombNotice: boolean;
};

type RemoveClickBombMode = {
  clicked: boolean;
  bombMode: boolean;
};

type DefeatExplodeBomb = {
  explodeTrigger: boolean;
  explodeFire: boolean;
  bombMode: boolean;
};

type ExplodeFire = {
  explodeFire: boolean;
};

type ModalTimer = {
  timer: boolean;
};

type ModalCleanup = {
  modalCleanup: boolean;
};

type ModalVisibility = {
  isVisible: boolean;
};

type Flagged = {
  flagged: boolean;
};

type QuestionMarked = {
  questionMarked: boolean;
};

type FlaggedFlagCount = {
  flags: number;
  flagged: boolean;
};

type QuestionMarkedQsCount = {
  questions: number;
  questionMarked: boolean;
};

type SquareHint = {
  hint: boolean;
};

type SquareClicked = {
  clicked: boolean;
};

type SquareNeighbors = {
  neighbors: string[];
  adjacentBombCount: number;
};

type SquaresRevealed = {
  revealed: number;
};

type VictorySet = {
  progress: number;
  victoryNotice: boolean;
  bombFade: boolean;
};

type BombNotice = {
  bombNotice: boolean;
};

type BombClicked = {
  currentLives: number;
  bombMode: boolean;
  explodeTrigger: boolean;
};

type DefeatNotice = {
  defeatNotice: boolean;
  progress: number;
};

type Initialized = {
  initialized: boolean;
};

type PushClickHistory = {
  key: string;
};

type GameReset = {
  gameReset: boolean;
};

type SquaresComplete = {
  squaresComplete: boolean;
};

type BombPositionsAssigned = {
  bombPositionsAssigned: boolean;
};

type SquaresPruned = {
  squaresPruned: boolean;
};

type LastClicked = {
  lastClicked: string;
};

/* ***********************************
  Component Payload Types (Reducers)
*********************************** */

export type FormPd = {
  size: number;
  difficulty: number;
  lives: number;
  errorString: string;
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

export type AppAction =
  | { type: "GAME_INIT"; payload: GameInit }
  | { type: "GAME_RESET"; payload: GameReset }
  | { type: "GAME_RESET_CLEANUP"; payload: GameResetCleanup }
  | { type: "SQUARES_INITIALIZED"; payload: Initialized }
  | { type: "LAST_CLICKED"; payload: LastClicked }
  | { type: "GAMESTATE_SET_PROGRESS"; payload: Progress }
  | { type: "MODES_GAMEBOARD_DRAWING"; payload: Drawing }
  | { type: "SET_FLAG_QUESTION"; payload: ModeToggle }
  | { type: "GAMESTATS_SET_BOMB_COUNT"; payload: BombCount }
  | { type: "GAMESTATS_UPDATE_TOTALTOREVEAL"; payload: TotalToReveal }
  | { type: "FORM_TOGGLE_SQUARESCROLL"; payload: DictBool }
  | { type: "SQUARES_ADD"; key: string; payload: SquareDataType }
  | { type: "SQUARES_DELETE"; key: string }
  | { type: "SQUARES_BOMB"; key: string; payload: Bomb }
  | { type: "EXPLODE_TRIGGER"; key: string; payload: ExplodeTrigger }
  | { type: "EXPLODE_TIMER"; key: string; payload: ExplodeTimer }
  | {
    type: "SQUARES_NOTICES_CLEANUP";
    key: string;
    payload: SquaresNoticesCleanup;
  }
  | { type: "REMOVE_CLICK_BOMBMODE"; key: string; payload: RemoveClickBombMode }
  | { type: "DEFEAT_EXPLODE_BOMB"; key: string; payload: DefeatExplodeBomb }
  | { type: "EXPLODE_FIRE"; key: string; payload: ExplodeFire }
  | { type: "SQUARE_HINT"; key: string; payload: SquareHint }
  | { type: "SQUARE_CLICKED"; key: string; payload: SquareClicked }
  | { type: "SQUARE_NEIGHBORS"; key: string; payload: SquareNeighbors }
  | { type: "MODAL_TIMER"; payload: ModalTimer }
  | { type: "MODAL_CLEANUP"; payload: ModalCleanup }
  | { type: "MODAL_VISIBILITY"; payload: ModalVisibility }
  | { type: "TOGGLE_NEWGAME"; payload: NewGame }
  | { type: "FLAGGED_FLAG_COUNT"; key: string; payload: FlaggedFlagCount }
  | { type: "SQUARES_INIT_COMPLETE"; payload: SquaresComplete }
  | { type: "SQUARES_PRUNED"; payload: SquaresPruned }
  | {
    type: "QUESTIONMARKED_QS_COUNT";
    key: string;
    payload: QuestionMarkedQsCount;
  }
  | { type: "FLAGGED"; key: string; payload: Flagged }
  | { type: "QUESTIONMARKED"; key: string; payload: QuestionMarked }
  | { type: "SQUARES_REVEALED"; payload: SquaresRevealed }
  | { type: "VICTORY_SET"; payload: VictorySet }
  | { type: "BOMB_NOTICE"; payload: BombNotice }
  | { type: "BOMB_CLICKED"; key: string; payload: BombClicked }
  | { type: "DEFEAT_NOTICE"; payload: DefeatNotice }
  | { type: "BOMB_POSITIONS_ASSIGNED"; payload: BombPositionsAssigned }
  | { type: "PUSH_CLICK_HISTORY"; payload: PushClickHistory };

export type FormAction =
  | { type: "FORM_INIT_VALUES"; payload: SizeDifficultyLives }
  | { type: "FORM_SET_SIZE"; payload: DictNumber }
  | { type: "FORM_SET_DIFFICULTY"; payload: DictNumber }
  | { type: "FORM_SET_LIVES"; payload: DictNumber }
  | { type: "FORM_SET_ERROR"; payload: DictString };

export type SquareAction =
  | { type: "SQUARE_ALL_VALUES"; payload: SquarePd }
  | { type: "SQUARE_SET_BOMB_ANIM"; payload: DictBool }
  | { type: "SQUARE_SET_FIRE_ANIM"; payload: DictBool };

export type StatsAction =
  | { type: "STATS_INIT_VALUES"; payload: StatsPd }
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
};

export type StatsProps = {
  gameStats: GameStats;
  options: SizeDifficultyLives;
  totalToReveal: (totalToReveal: number) => void;
};

export type QuestionProps = {
  modes: ModesType;
  progress: number;
  onModeClick(e: React.FormEvent<HTMLFormElement>): void;
};

export type NoticesProps = {
  notices: Notices;
};

export type FormProps = {
  progress: number;
  data: CustomGameValues;
  options: SizeDifficultyLives;
  modalClose: () => void;
  saveOptions: (obj: SizeDifficultyLives) => void;
};

export type FlagProps = {
  modes: ModesType;
  progress: number;
  onModeClick(e: React.FormEvent<HTMLFormElement>): void;
};

export type ColumnProps = {
  columnKey: string;
  animations: AnimationsType;
  gameState: GameState;
  modes: ModesType;
  squares: SquaresType;
  size: number;
  explode: (squareKey: string) => void;
  onSquareClick: (squareKey: string) => void;
  toggleScroll: (bool: boolean, anim: string) => void;
};
