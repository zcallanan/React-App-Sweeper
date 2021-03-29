import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "../Form/Form";
import Column from "../Column/Column";
import Flag from "../Flag/Flag";
import Header from "../Header/Header";
import QuestionMark from "../QuestionMark/QuestionMark";
import Stats from "../Stats/Stats";
import Notice from "../Notice/Notice";
import { randomIntFromInterval } from "../../helpers";
import appReducer from "./app-reducer";
import { appInit, dataInit, squareInit } from "./app-init";
import {
  GameState,
  SquaresType,
  ModalType,
  ModesType,
  GameStats,
  SizeDifficultyLives,
} from "../../types";

const App = (): JSX.Element => {
  // Manage state
  const [appState, appDispatch] = React.useReducer(appReducer, appInit);

  /* -----------------------
    Find Square neighbors
  ----------------------- */

  const needsNeighbors = React.useCallback(
    // Generate an array of squares that need neighbors populated
    (clickedSquare: string): string[] => {
      // eslint-disable-next-line prefer-destructuring
      const squares: SquaresType = appState.squares;
      const squaresArray = Object.keys(squares);
      const result: string[] = [];
      if (squaresArray.length > 1) {
        const keyValues = Object.entries(squares).filter((value) => (
          !value[1].bomb
          && !value[1].neighbors.length
          && (value[0] === clickedSquare
          || squares[clickedSquare].neighbors.includes(value[0]))
        ));
        if (keyValues.length) {
          keyValues.forEach((subArray) => {
            result.push(subArray[0]);
          });
        }
      }
      return result;
    },
    [appState],
  );

  const populateNeighbors = React.useCallback((squareKey: string): void => {
    // Populate neighbors property for a square
    // eslint-disable-next-line prefer-destructuring
    const squares: SquaresType = appState.squares;
    const { size }: { size: number } = appState.gameState.options;
    const row = Number(squareKey.split("-")[0].match(/\d{1,3}/)[0]);
    const column = Number(
      squareKey.split("-")[1].match(/(\d{1,3})/)[0],
    );
    const neighbors: string[] = [];
    if (row - 1 >= 0) {
      // If it's not the first row
      neighbors.push(`r${row - 1}-s${column}`);
      if (column - 1 >= 0) {
        // If it's not the first column
        neighbors.push(`r${row - 1}-s${column - 1}`);
      }
      if (column + 1 !== size) {
        // If it's not the last column
        neighbors.push(`r${row - 1}-s${column + 1}`);
      }
    }
    if (column - 1 >= 0) {
      neighbors.push(`r${row}-s${column - 1}`);
    }
    if (column + 1 !== size) {
      neighbors.push(`r${row}-s${column + 1}`);
    }
    if (row + 1 !== size) {
      // If it's not the last row
      neighbors.push(`r${row + 1}-s${column}`);
      if (column - 1 >= 0) {
        // If it's not the first column
        neighbors.push(`r${row + 1}-s${column - 1}`);
      }
      if (column + 1 !== size) {
        // If it's not the last column
        neighbors.push(`r${row + 1}-s${column + 1}`);
      }
    }
    // Calculate neighbors that have bombs to squareKey
    let adjacentBombCount = 0;
    neighbors.forEach((neighbor) => {
      if (squares[neighbor].bomb) {
        adjacentBombCount += 1;
      }
    });
    // Save neighbor array and adjacentBombCount to state for squareKey
    appDispatch({
      type: "SQUARE_NEIGHBORS",
      key: squareKey,
      payload: {
        neighbors,
        adjacentBombCount,
      },
    });
  }, [appState]);

  React.useEffect((): void => {
    // Generates neighbors and adjacentBombCount for all squares
    // eslint-disable-next-line prefer-destructuring
    const squares: SquaresType = appState.squares;
    const squaresArray: string[] = Object.keys(squares);
    const { clickHistory }: { clickHistory: string[] } = appState.gameState;
    if (squaresArray.length > 1) {
      let neighborKeys: string[];
      clickHistory.forEach((clickedSquare) => {
        neighborKeys = [];
        neighborKeys = needsNeighbors(clickedSquare);
        neighborKeys.forEach((neighbor) => {
          if (!squares[neighbor].neighbors.length) {
            populateNeighbors(neighbor);
          }
        });
      });
    }
  }, [needsNeighbors, appState.squares, populateNeighbors, appState.gameState]);

  /* ---------------------------------------------------------------
    Calculate gameStats number of squares revealed (win condition)
  --------------------------------------------------------------- */

  const getRevealed = React.useCallback((): number => Object.values(appState.squares)
    .filter((value) => value.clicked && !value.bomb).length, [appState.squares]);

  React.useEffect((): void => {
    // Calculate revealed squares
    const revealed = getRevealed();
    appDispatch({
      type: "SQUARES_REVEALED",
      payload: {
        revealed,
      },
    });
  }, [getRevealed]);

  /* ------------------------------------------------------
    Calculate gameStats number of bombs on the game board
  ------------------------------------------------------ */

  const calculateBombs = React.useCallback((): number => {
    // Determines bomb count based on difficulty and board size
    let percentage: number;
    const { difficulty }: { difficulty: number } = appState.gameState.options;
    const { size }: { size: number } = appState.gameState.options;
    // Get percentage of bombs
    Object.entries(dataInit.bombPercentage).forEach((value) => {
      if (Number(value[0]) === difficulty) {
        percentage = parseFloat(value[1]) * 0.01;
      }
    });
    const bombs = Math.floor(size ** 2 * percentage);
    return bombs;
  }, [appState.gameState.options]);

  React.useEffect((): void => {
    // Saves bomb count to state if it's a value > 1
    const { bombs }: { bombs: number } = appState.gameStats;
    const { squaresComplete }: { squaresComplete: boolean } = appState.gameState;
    if (bombs < 1 && squaresComplete) {
      const bombCount = calculateBombs();
      if (bombCount && bombCount > 1) {
        appDispatch({
          type: "GAMESTATS_SET_BOMB_COUNT",
          payload: {
            bombCount,
          },
        });
      }
    }
  }, [calculateBombs, appState.gameStats, appState.gameState]);

  /* --------------------------------------------------------------
    When a square is clicked, all nonbomb, nonhint squares clicked
  --------------------------------------------------------------- */

  const needsToBeClicked = React.useCallback((): string[] => {
    // Returns array of square key strings to be clicked
    // eslint-disable-next-line prefer-destructuring
    const squares: SquaresType = appState.squares;
    const squaresArray = Object.keys(squares);
    const result: string[] = [];
    if (squaresArray.length > 1) {
      const toBeClicked = Object.entries(squares).filter((value) => (
        !value[1].adjacentBombCount
        && !value[1].clicked
        && !value[1].hint
      ));
      if (toBeClicked.length) {
        toBeClicked.forEach((subArray) => result.push(subArray[0]));
      }
    }
    return result;
  }, [appState.squares]);

  React.useEffect((): void => {
    /* If a neighbor has no adjacent bombs, hasn't been clicked or
    had its hint revealed, then mark it clicked */
    const squareKeys: string[] = needsToBeClicked();
    const { gameReset }: { gameReset: boolean } = appState.gameState;
    if (squareKeys.length && !gameReset) {
      squareKeys.forEach((squareKey) => {
        // Set square as clicked in state
        appDispatch({
          type: "SQUARE_CLICKED",
          key: squareKey,
          payload: {
            clicked: true,
          },
        });
        /* Save clicked in history so that further neighbors are checked as
        either bombs(ignored), hints, or to be clicked */
        appDispatch({
          type: "PUSH_CLICK_HISTORY",
          payload: {
            key: squareKey,
          },
        });
      });
    }
  }, [needsToBeClicked, appState.gameState]);

  /* -----------------------------------------------------------------------
    When a square is clicked, all nonbomb, nonclicked neighbors gain hints
  ------------------------------------------------------------------------ */

  const needsHint = React.useCallback((): string[] => {
    // Returns array of square key strings to be marked as hints
    // eslint-disable-next-line prefer-destructuring
    const squares: SquaresType = appState.squares;
    const squaresArray = Object.keys(squares);
    const result: string[] = [];
    if (squaresArray.length > 1) {
      const toBeHinted = Object.entries(squares).filter((value) => (
        value[1].adjacentBombCount > 0
        && !value[1].clicked
        && !value[1].hint
      ));
      if (toBeHinted.length) {
        toBeHinted.forEach((subArray) => result.push(subArray[0]));
      }
    }
    return result;
  }, [appState.squares]);

  React.useEffect((): void => {
    /* If a neighbor has an adjacent bomb, hasn't been clicked or
    had its hint revealed, then reveal its hint */
    const squareKeys: string[] = needsHint();
    if (squareKeys.length) {
      squareKeys.forEach((squareKey) => {
        appDispatch({
          type: "SQUARE_HINT",
          key: squareKey,
          payload: {
            hint: true,
          },
        });
      });
    }
  }, [needsHint]);

  /* ----------------------
    Set gameState options
  ---------------------- */

  React.useEffect((): void => {
    // Get options from local storage or default starting values
    const { options }: { options: SizeDifficultyLives } = appState.gameState;
    const { optionsSet }: { optionsSet: boolean } = appState.gameState;
    let progress;
    let size: number;
    let difficulty: number;
    let lives: number;
    if ((options.size === -1 || options.difficulty === -1) && !optionsSet) {
      progress = 0;
      // Read options from local storage
      const localStorageRef = localStorage.getItem("sweeper-options");
      if (localStorageRef) {
        const storageOptions = JSON.parse(localStorageRef);
        size = storageOptions.size;
        difficulty = storageOptions.difficulty;
        lives = storageOptions.lives;
      } else {
        // No local storage, set initial default values
        size = 10;
        difficulty = 2;
        lives = 2;
      }
      appDispatch({
        type: "GAME_INIT",
        payload: {
          optionsSet: true,
          progress,
          options: {
            size,
            difficulty,
            lives,
          },
          currentLives: Number(dataInit.numberOfLives[lives]),
          newGame: true,
        },
      });
    }
  }, [appState.gameState]);

  /* -------------------------
    Create gameboard squares
  ------------------------- */

  const initSquares = React.useCallback((): void => {
    const { gameReset }: { gameReset: boolean } = appState.gameState;
    appDispatch({
      type: "SQUARES_INITIALIZED",
      payload: {
        initialized: true,
      },
    });

    if (!gameReset) {
      // No draw on gameReset
      setTimeout(() => {
        // When the board initially draws input is disabled.
        appDispatch({
          type: "MODES_GAMEBOARD_DRAWING",
          payload: {
            drawing: false,
          },
        });
      }, 1500); // Timer ~synced with square draw anim transition of 1.5s
    }
  }, [appState.gameState]);

  React.useEffect((): void => {
    const { initialized }: { initialized: boolean } = appState.gameState;
    const { size }: { size: number } = appState.gameState.options;
    const { optionsSet }: { optionsSet: boolean } = appState.gameState;
    if (!initialized && size > 0 && optionsSet) {
      initSquares();
    }
  }, [appState.gameState, initSquares]);

  /* ---------------------------------------
    Mark squares that contain hidden bombs
  --------------------------------------- */

  const assignSquaresAsBombs = React.useCallback((
    positionArray: string[],
    count: number,
  ): number => {
    const { bombs }: { bombs: number } = appState.gameStats;
    let inc: number = count;
    if (inc < bombs) {
      const { size }: { size: number } = appState.gameState.options;
      // Generate a random square key
      const tempPosition = `r${
        randomIntFromInterval(0, size - 1)
      }-s${
        randomIntFromInterval(0, size - 1)
      }`;

      /* Determine whether positionArray already contains tempPosition
      If it does, then discard it and generate a different tempPosition
      If it does not, then save it to positionArray */
      if (!positionArray.includes(tempPosition)) {
        positionArray.push(tempPosition);
        inc += 1;
        appDispatch({
          type: "SQUARES_BOMB",
          key: tempPosition,
          payload: {
            bomb: true,
          },
        });
        assignSquaresAsBombs(positionArray, inc);
      } else {
        // If position was a dupe, inc is not incremented, get another tempPosition
        assignSquaresAsBombs(positionArray, inc);
      }
    }
    // Once positionArray has the number of bombs - 1 that we need, return
    appDispatch({
      type: "BOMB_POSITIONS_ASSIGNED",
      payload: {
        bombPositionsAssigned: true,
      },
    });
    return 1;
  }, [appState.gameState.options, appState.gameStats]);

  React.useEffect((): void => {
    /* Assign bomb value to squares */
    const { bombs }: { bombs: number } = appState.gameStats;
    const { squaresComplete }: { squaresComplete: boolean } = appState.gameState;
    const { bombPositions }: { bombPositions: string[] } = appState.gameState;
    if (bombs && squaresComplete && !bombPositions.length) {
      const positionArray: string[] = [];
      assignSquaresAsBombs(positionArray, 0);
    }
  }, [
    assignSquaresAsBombs,
    appState.gameStats,
    appState.gameState,
  ]);

  /* ------------------------
    Recover from game reset
  ------------------------ */

  React.useEffect((): void => {
    /* Once bombs assigned, if the game was reset by the form, mark as false */
    const { gameReset }: { gameReset: boolean } = appState.gameState;
    if (gameReset) {
      appDispatch({
        type: "GAME_RESET",
        payload: {
          gameReset: false,
        },
      });
      appDispatch({
        type: "SQUARES_INITIALIZED",
        payload: {
          initialized: false,
        },
      });
    }
  }, [appState.gameState]);

  /* ---------------------------------------
    Form submitted, reset the game board
  --------------------------------------- */

  React.useEffect((): void => {
    /* Reset values following Form submit -> game reset */
    appDispatch({
      type: "GAME_RESET_CLEANUP",
      payload: {
        seed: randomIntFromInterval(1, 9999),
        bombs: -1,
        clickHistory: [],
        bombPositions: [],
        lastClicked: "",
        bombPositionsAssigned: false,
        squaresComplete: false,
        squaresPruned: false,
        bombFade: false,
        isVisible: false,
        timer: false,
        modalCleanup: false,
        revealed: 0,
        flags: 0,
        questions: 0,
        bombNotice: false,
        victoryNotice: false,
        defeatNotice: false,
      },
    });
    appDispatch({
      type: "SQUARES_INITIALIZED",
      payload: {
        initialized: false,
      },
    });
  }, [appState.gameState.gameReset]);

  /* -----------------------------------------
    Mark square as flagged or questionMarked
  ----------------------------------------- */

  React.useEffect(() => {
    const { flagMode }: { flagMode: boolean } = appState.modes;
    const { questionMode }: { questionMode: boolean } = appState.modes;
    // eslint-disable-next-line prefer-destructuring
    let flags: number = appState.gameStats.flags;
    // eslint-disable-next-line prefer-destructuring
    let questions: number = appState.gameStats.questions;
    // eslint-disable-next-line prefer-destructuring
    const lastClicked: string = appState.gameState.lastClicked;
    // eslint-disable-next-line prefer-destructuring
    const squares: SquaresType = appState.squares;
    let flagged: boolean;
    let questionMarked;

    if (flagMode && lastClicked !== "") {
      // If marking a flag is active, then mark only that square and then save to state
      flagged = !squares[lastClicked].flagged;
      if (flagged) {
        // If a flag is placed, increment the flag count
        flags += 1;
      } else {
        // If a flag is removed, decrement the flag count
        flags -= 1;
      }
      appDispatch({
        type: "FLAGGED_FLAG_COUNT",
        key: lastClicked,
        payload: {
          flags,
          flagged,
        },
      });
      if (squares[lastClicked].questionMarked) {
        // If the square is question marked when placing a flag, remove questionMarked
        questionMarked = !squares[lastClicked].questionMarked;
        appDispatch({
          type: "QUESTIONMARKED",
          key: lastClicked,
          payload: {
            questionMarked,
          },
        });
      }
    } else if (questionMode && lastClicked !== "") {
      /* If placing a question mark is active, then mark only that square
      and then save to state */
      questionMarked = !squares[lastClicked].questionMarked;
      if (questionMarked) {
        // If a question mark is placed, increment the question mark count
        questions += 1;
      } else {
        // If a question mark is removed, decrement the question mark count
        questions -= 1;
      }
      appDispatch({
        type: "QUESTIONMARKED_QS_COUNT",
        key: lastClicked,
        payload: {
          questions,
          questionMarked,
        },
      });
      if (squares[lastClicked].flagged) {
        // If the square is flagged when placing a question mark, unflag it
        flagged = !squares[lastClicked].flagged;
        appDispatch({
          type: "FLAGGED",
          key: lastClicked,
          payload: {
            flagged,
          },
        });
      }
    }
    appDispatch({
      type: "LAST_CLICKED",
      payload: {
        lastClicked: "",
      },
    });
  }, [
    appState.modes,
    appState.gameState.lastClicked,
    appState.gameStats.flags,
    appState.gameStats.questions,
    appState.squares]);

  /* -------------------------------------------------------------------
    Prune excess square properties when game board shrinks after reset
  ------------------------------------------------------------------- */

  React.useEffect((): void => {
    const { initialized }: { initialized: boolean } = appState.gameState;
    const { gameReset }: { gameReset: boolean } = appState.gameState;
    if (initialized && gameReset) {
      const { squares }: { squares: SquaresType } = appState;
      const { size }: { size: number } = appState.gameState.options;

      let row = 0;
      let column = 0;
      Object.keys(squares).forEach((square: string) => {
        row = Number(square.split("-")[0].match(/\d{1,3}/)[0]);
        column = Number(square.split("-")[1].match(/(\d{1,3})/)[0]);
        /* Check to see if squares has any rows or columns greater
          than the board size - 1. If so, delete from state */
        if (row > size - 1 || column > size - 1) {
          appDispatch({
            type: "SQUARES_DELETE",
            key: square,
          });
        }
      });
    }
    appDispatch({
      type: "SQUARES_PRUNED",
      payload: {
        squaresPruned: true,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.gameState.initialized, appState.gameState.gameReset]);

  /* -------------------------------------------
    Assign default values to square properties
  ------------------------------------------- */

  const addSquare = React.useCallback((rowNum: number, colNum: number): number => {
    const { size }: { size: number } = appState.gameState.options;
    let i: number = rowNum;
    let k: number = colNum;
    if (k === size) {
      // Roll over to the next row/column set if k equals size
      [i, k] = [i + 1, 0];
    }

    if (i < size) {
      // Still rows to add, add square to squares state
      appDispatch({
        type: "SQUARES_ADD",
        key: `r${i}-s${k}`,
        payload: { ...squareInit },
      });

      // Increment column # by one each time through
      addSquare(i, k + 1);
    }

    // End recursion if row # is equal to size
    appDispatch({
      type: "SQUARES_INIT_COMPLETE",
      payload: {
        squaresComplete: true,
      },
    });
    return 1;
  }, [appState.gameState.options]);

  React.useEffect((): void => {
    const { initialized }: { initialized: boolean } = appState.gameState;
    const { squaresPruned }: { squaresPruned: boolean } = appState.gameState;
    if (initialized && squaresPruned) {
      appDispatch({
        type: "SQUARES_PRUNED",
        payload: {
          squaresPruned: false,
        },
      });
      // Add square properties to squares gameState
      addSquare(0, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.gameState.initialized, appState.gameState.squaresPruned, addSquare]);

  /* ****************
    Component Props
  **************** */

  const toggleScroll = (bool: boolean, anim: string): void => {
    /* Prop for squares to update squareScroll state */
    appDispatch({
      type: "FORM_TOGGLE_SQUARESCROLL",
      payload: {
        [anim]: bool,
      },
    });
  };

  const saveOptions = (obj: SizeDifficultyLives): void => {
    /* User submits form: Save Player's game board options */
    toggleScroll(true, "squareScroll");
    // Apply submitted data to state
    appDispatch({
      type: "GAME_INIT",
      payload: {
        optionsSet: true,
        progress: 0,
        options: {
          size: obj.size,
          difficulty: obj.difficulty,
          lives: obj.lives,
        },
        currentLives: Number(dataInit.numberOfLives[obj.lives]),
        newGame: true,
      },
    });
    appDispatch({
      type: "GAME_RESET",
      payload: {
        gameReset: true,
      },
    });
    // Save user selection to local storage
    localStorage.setItem("sweeper-options", JSON.stringify(obj));
  };

  const updateTotalToReveal = (totalToReveal: number): void => {
    /* Prop for stats to pass to global state */
    const totalToRevealState: number = appState.gameStats.totalToReveal;
    if (
      (totalToReveal > 0 && totalToRevealState <= 0)
      || totalToReveal !== totalToRevealState
    ) {
      appDispatch({
        type: "GAMESTATS_UPDATE_TOTALTOREVEAL",
        payload: {
          totalToReveal,
        },
      });
    }
  };

  const onModeClick = (e: React.FormEvent<HTMLFormElement>): void => {
    /* Prop to toggle state when mode buttons are clicked (flag, question mark) */
    e.preventDefault();
    // 1. From State
    const { modes }: { modes: ModesType } = appState;
    // 2. Change setting
    modes[(e.target as HTMLFormElement).name] = !modes[
      (e.target as HTMLFormElement).name
    ];
    // 3. If mode X toggles to true, then make sure mode Y is false
    if (
      (e.target as HTMLFormElement).name === "flagMode"
      && modes[(e.target as HTMLFormElement).name]
    ) {
      modes.questionMode = false;
    } else if (
      (e.target as HTMLFormElement).name === "questionMode"
      && modes[(e.target as HTMLFormElement).name]
    ) {
      modes.flagMode = false;
    }
    // 4. Save change
    appDispatch({
      type: "SET_FLAG_QUESTION",
      payload: {
        flagMode: modes.flagMode,
        questionMode: modes.questionMode,
      },
    });
  };

  const modalShow = () => {
    /* Modal component toggle to reveal modal */
    let { isVisible }: { isVisible: boolean } = appState.modal;
    if (!isVisible) {
      isVisible = true;
      appDispatch({
        type: "MODAL_VISIBILITY",
        payload: {
          isVisible,
        },
      });
    }
    return isVisible;
  };

  const explodeCleanup = (squareKey: string): void => {
    /* Cleanup bombMode, resetting bomb square, reset bombNotice,
      and remove disabled from clickable squares */
    appDispatch({
      type: "SQUARES_NOTICES_CLEANUP",
      key: squareKey,
      payload: {
        explodeTrigger: false,
        explodeTimer: false,
        explodeCleanup: false, // TODO ???
        bombNotice: false,
      },
    });

    setTimeout(() => {
      const { progress }: { progress: number } = appState.gameState;
      // Reset square and hide the bomb
      if (progress === 0) {
        appDispatch({
          type: "REMOVE_CLICK_BOMBMODE",
          key: squareKey,
          payload: {
            clicked: false,
            bombMode: false,
          },
        });
      } else if (progress === -1) {
        // Handle defeat bomb explosion progression
        appDispatch({
          type: "DEFEAT_EXPLODE_BOMB",
          key: squareKey,
          payload: {
            explodeTrigger: false,
            explodeFire: true,
            bombMode: false,
          },
        });
        // squares[squareKey].explosion.explodeTrigger = false;
        // squares[squareKey].explosion.explodeFire = true;
        // this.setState({ squares });
        // setTimeout(() => {
        //   appDispatch({
        //     type: "EXPLODE_FIRE",
        //     key: squareKey,
        //     payload: {
        //       explodeFire: false,
        //     },
        //   });
        // }, 1000);

        const { modal }: { modal: ModalType } = appState;
        if (!modal.isVisible && !modal.timer) {
          // Handle displaying the play again modal upon defeat
          appDispatch({
            type: "MODAL_TIMER",
            payload: {
              timer: true,
            },
          });
          setTimeout(() => {
            modalShow();
            appDispatch({
              type: "MODAL_CLEANUP",
              payload: {
                modalCleanup: true,
              },
            });
          }, 5000);
        }
      }
    }, 1000); // triggers bomb explosion enter anim
  };

  const explode = (squareKey: string): void => {
    /* Prop for Square component when clicking on a bomb square */
    console.log("explode");
    const { squares }: { squares: SquaresType } = appState;
    if (!squares[squareKey].explosion.explodeCleanup) {
      console.log("no Cleanup");
      // Prevent further animations if it's time to cleanup
      appDispatch({
        type: "EXPLODE_TRIGGER",
        key: squareKey,
        payload: {
          explodeTrigger: false,
        },
      });
      setTimeout(() => {
        appDispatch({
          type: "EXPLODE_TRIGGER",
          key: squareKey,
          payload: {
            explodeTrigger: true,
          },
        });
      }, 1000);
      if (!squares[squareKey].explosion.explodeTimer) {
        // Start a timer to stop bomb animation
        // Timer started, prevent it from starting again
        // TODO was not saving this, what happens?
        appDispatch({
          type: "EXPLODE_TIMER",
          key: squareKey,
          payload: {
            explodeTimer: true,
          },
        });
        // bomb explosion timer
        setTimeout(() => {
          explodeCleanup(squareKey);
        }, 3000);
      }
    }
  };

  // Prop for Square component when clicking on a square
  const onSquareClick = (squareKey: string): void => {
    // 1. From state
    const { squares }: { squares: SquaresType } = appState;
    const { gameStats }: { gameStats: GameStats } = appState;
    // let { flags }: { flags: number } = gameStats;
    // let { questions }: { questions: number } = gameStats;
    const { revealed }: { revealed: number } = gameStats;
    const { totalToReveal }: { totalToReveal: number } = gameStats;

    const { modes }: { modes: ModesType } = appState;
    const { bomb }: { bomb: boolean } = squares[squareKey];
    const { flagMode }: { flagMode: boolean } = modes;
    const { questionMode }: { questionMode: boolean } = modes;
    // let flagged: boolean;
    // let questionMarked;

    if (modes.newGame) {
      appDispatch({
        type: "TOGGLE_NEWGAME",
        payload: {
          newGame: false,
        },
      });
    }
    if (flagMode || questionMode) {
      appDispatch({
        type: "LAST_CLICKED",
        payload: {
          lastClicked: squareKey,
        },
      });
    } else {
      appDispatch({
        type: "SQUARE_CLICKED",
        key: squareKey,
        payload: {
          clicked: true,
        },
      });

      if (!bomb) {
        /* Set click history to initiate checking neighbors as hints,
        bombs, or to be clicked */
        appDispatch({
          type: "PUSH_CLICK_HISTORY",
          payload: {
            key: squareKey,
          },
        });

        // Handle Win
        if (revealed === totalToReveal) {
          const { modal }: { modal: ModalType } = appState;
          appDispatch({
            type: "VICTORY_SET",
            payload: {
              progress: 1,
              victoryNotice: true,
              bombFade: true,
            },
          });
          if (!modal.isVisible && !modal.timer) {
            // Handle displaying the play again modal upon win
            appDispatch({
              type: "MODAL_TIMER",
              payload: {
                timer: true,
              },
            });
            setTimeout(() => {
              modalShow();
              appDispatch({
                type: "MODAL_CLEANUP",
                payload: {
                  modalCleanup: true,
                },
              });
            }, 3500);
          }

          Object.keys(squares).forEach((key) => {
            console.log("Reveal the board");
            if (!squares[key].clicked) {
              // Reveal the board
              appDispatch({
                type: "SQUARE_CLICKED",
                key,
                payload: {
                  clicked: true,
                },
              });
            }
          });
        }
      } else {
        // Clicked on a bomb, update lives
        const currentLives: number = appState.gameStats.currentLives - 1;
        // Save clicking on a bomb to state
        appDispatch({
          type: "BOMB_CLICKED",
          key: squareKey,
          payload: {
            currentLives,
            bombMode: true,
            explodeTrigger: true,
          },
        });
        // Check whether the game is over
        if (currentLives >= 0) {
          // If the game is still going, show Bomb notice
          appDispatch({
            type: "BOMB_NOTICE",
            payload: {
              bombNotice: true,
            },
          });
        } else {
          // Handle defeat
          appDispatch({
            type: "DEFEAT_NOTICE",
            payload: {
              defeatNotice: true,
              progress: -1,
            },
          });
          console.log("Defeated");
          Object.keys(squares).forEach((key) => {
            if (!squares[key].clicked) {
              // Reveal the board when you lose
              appDispatch({
                type: "SQUARE_CLICKED",
                key,
                payload: {
                  clicked: true,
                },
              });
              if (squares[key].bomb) {
                // Trigger all bombs to play their explosion animation
                appDispatch({
                  type: "EXPLODE_TRIGGER",
                  key,
                  payload: {
                    explodeTrigger: true,
                  },
                });
              }
            }
          });
        }
      }
    }
  };

  /* Modal fn's */

  const modalClose = (): boolean => {
    let { isVisible }: { isVisible: boolean } = appState.modal;
    if (isVisible) {
      isVisible = false;
      appDispatch({
        type: "MODAL_VISIBILITY",
        payload: {
          isVisible,
        },
      });
    }
    return isVisible;
  };

  const modalGameStateMessage = (): string => {
    const { progress }: { progress: number } = appState.gameState;
    if (progress === 1) {
      // Win message
      return "Congrats, You Won!";
    }
    if (progress === -1) {
      // Defeat message
      return "You Lost!";
    }
    return "Customize Settings";
  };

  const modalSettingsButtonText = (): string => {
    const { progress }: { progress: number } = appState.gameState;
    const { modalCleanup }: { modalCleanup: boolean } = appState.modal;
    if (progress !== 0 && modalCleanup) {
      return "Play Again?";
    }
    return "Customize Settings";
  };

  const renderModal = (): JSX.Element => {
    const { isVisible }: { isVisible: boolean } = appState.modal;
    const { gameState }: { gameState: GameState } = appState;
    let output: JSX.Element;
    if (isVisible) {
      output = (
        <div>
          <Modal
            show={isVisible}
            onHide={modalClose} // Handles closing modal on ESC or clicking on overlay
          >
            <Modal.Header>
              <h3>{modalGameStateMessage()}</h3>
            </Modal.Header>
            <Modal.Body>
              <Form
                modalClose={modalClose}
                options={gameState.options}
                saveOptions={saveOptions}
                data={dataInit}
                progress={gameState.progress}
              />
            </Modal.Body>
          </Modal>
        </div>
      );
    }
    return output;
  };

  const columns = [];
  let columnKey: string;
  for (let i = 0; i < appState.gameState.options.size; i += 1) {
    columnKey = `s${i}`;
    columns.push(
      <Column
        key={columnKey}
        columnKey={columnKey}
        modes={appState.modes}
        animations={appState.animations}
        squares={appState.squares}
        size={appState.gameState.options.size}
        onSquareClick={onSquareClick}
        toggleScroll={toggleScroll}
        explode={explode}
        gameState={appState.gameState}
      />,
    );
  }

  return (
    <div>
      <Header />
      <div className="game-board container">
        <div>{renderModal()}</div>
        <div className="game-body row">
          <div className="col-3">
            {/* eslint-disable-next-line react/button-has-type */}
            <button className="btn btn-secondary buttons" onClick={modalShow}>
              {modalSettingsButtonText()}
            </button>
            <Notice notices={appState.notices} />
            <Stats
              gameStats={appState.gameStats}
              options={appState.gameState.options}
              totalToReveal={updateTotalToReveal}
            />
            <div className="modes">
              <Flag
                onModeClick={onModeClick}
                modes={appState.modes}
                progress={appState.gameState.progress}
              />
              <QuestionMark
                onModeClick={onModeClick}
                modes={appState.modes}
                progress={appState.gameState.progress}
              />
            </div>
          </div>
          <div className="col-9">
            <div className="squares">{columns}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
