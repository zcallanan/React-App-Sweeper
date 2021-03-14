export type DictNumber = {
  [key: string]: number;
};

export type DictBool = {
  [key:string]: boolean
}

export type ExplosionType = {
  explodeTrigger: boolean;
  explodeTimer: boolean;
  explodeCleanup: boolean;
  explodeFire: boolean;
};

export type OptionObj = {
  size: string;
  difficulty: string;
  lives: string;
};

export type AnimationsType = {
  squareScroll: boolean;
  seed: number;
  bombFade: boolean;
};

export type ModalType = {
  isVisible: boolean;
  timer: boolean;
  modalCleanup: boolean;
};

export type DataType = {
  bombPercentage: { [key: number]: string };
  numberOfLives: { [key: number]: string };
};

export type OptionType = {
  size: number;
  difficulty: number;
  lives: number;
};

export type GameStateType = {
  progress: number;
  options: OptionType;
};

export type StatsType = {
  currentLives: number;
  bombs: number;
  revealed: number;
  totalToReveal: number;
  flags: number;
  questions: number;
};

export type NoticesType = {
  bombNotice: boolean;
  victoryNotice: boolean;
  defeatNotice: boolean;
};

export type ModesType = {
  newGame: boolean;
  bombMode: boolean;
  flagMode: boolean;
  questionMode: boolean;
  drawing: boolean;
};

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
