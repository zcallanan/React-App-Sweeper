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

// GameState data
export type GameState = {
  progress: number;
  options: SizeDifficultyLives;
};

export type SizeDifficultyLives = {
  size: number | string;
  difficulty: number | string;
  lives: number | string;
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
export type StatsType = {
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
