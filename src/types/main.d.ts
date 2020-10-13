declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

type explosionType = {
  explodeTrigger: boolean,
  explodeTimer: boolean,
  explodeCleanup: boolean,
  explodeFire: boolean
}

type optionObj = {
  size: string,
  difficulty: string,
  lives: string
}

type animationsType = {
  squareScroll: boolean,
  seed: number,
  bombFade: boolean
}

type modalType = {
  isVisible: boolean,
  timer: boolean,
  modalCleanup: boolean
}

type dataType = {
  bombPercentage: { [key: number]: string },
  numberOfLives: { [key: number]: string }
}

type optionType = {
  size: number,
  difficulty: number,
  lives: number
}

type gameStateType = {
  progress: number,
  options: optionType
}

type statsType = {
  currentLives: number,
  bombs: number,
  revealed: number,
  totalToReveal: number,
  flags: number,
  questions: number
}

type noticesType = {
  bombNotice: boolean,
  victoryNotice: boolean,
  defeatNotice: boolean
}

type modesType = {
  newGame: boolean,
  bombMode: boolean,
  flagMode: boolean,
  questionMode: boolean,
  drawing: boolean
}

type squaresType = {
  [key: string]: {
    bomb: boolean
    flagged: boolean,
    questionMarked: boolean,
    clicked: boolean,
    hint: boolean,
    neighbors: Array<string>,
    adjacentBombCount: number,
    explosion: explosionType
  }
}
