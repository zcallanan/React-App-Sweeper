import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "../Form/Form";
import Column from "../Column/Column";
import Flag from "../Flag/Flag";
import Header from "../Header/Header";
import QuestionMark from "../QuestionMark/QuestionMark";
import Stats from "../Stats/Stats";
import Notice from "../Notice/Notice";
import { randomIntFromInterval, useEffectDebugger } from "../../helpers";
import appReducer from "./app-reducer";
import { appInit, dataInit } from "./app-init";
import {
  GameState,
  SquaresType,
  ModesType,
  GameStats,
  SizeDifficultyLives,
} from "../../types";

const App = (): JSX.Element => {
  // Manage state
  const [appState, appDispatch] = React.useReducer(appReducer, appInit);

  /* ************************
    useEffect / useCallback
  ************************ */

  /* -----------------------
    Find Square neighbors
  ----------------------- */

  const needsNeighbors = React.useCallback(
    // Generate an array of squares that need neighbors populated
    (clickedSquare: string): string[] => {
      const squares = appState.squares;
      const squaresArray = Object.keys(squares);
      const result: string[] = [];
      if (squaresArray.length > 1) {
        const keyValues = Object.entries(squares).filter((value) => {
          return (
            !value[1].bomb
            && !value[1].neighbors.length
            && (value[0] === clickedSquare
              || squares[clickedSquare].neighbors.includes(value[0]))
          );
        });
        if (keyValues.length) {
          keyValues.forEach((subArray) => {
            result.push(subArray[0]);
          });
        }
      }
      return result;
    },
    [appState.squares]
  );

  const populateNeighbors = (squareKey: string): void => {
    // Populate neighbors property for a square
    const squares: SquaresType = appState.squares;
    const size: number = appState.gameState.options.size;
    const row: number = Number(squareKey.split("-")[0].match(/\d{1,3}/)[0]);
    const column: number = Number(
      squareKey.split("-")[1].match(/(\d{1,3})/)[0]
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
  };

  useEffectDebugger((): void => {
    // Generates neighbors and adjacentBombCount for all squares
    const squares = appState.squares;
    const squaresArray = Object.keys(squares);
    const clickHistory = appState.gameState.clickHistory;
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
  }, [needsNeighbors]);

  /* ---------------------------------------------------------------
    Calculate gameStats number of squares revealed (win condition)
  --------------------------------------------------------------- */

  const getRevealed = React.useCallback((): number => {
    // Get a count of clicked non-bomb squares
    return Object.values(appState.squares).filter(
      (value) => value.clicked && !value.bomb
    ).length;
  }, [appState.squares]);

  useEffectDebugger((): void => {
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
    const difficulty: number = appState.gameState.options.difficulty;
    const size: number = appState.gameState.options.size;
    // Get percentage of bombs
    Object.entries(dataInit.bombPercentage).forEach((value) => {
      if (Number(value[0]) === difficulty) {
        percentage = parseFloat(value[1]) * 0.01;
      }
    });
    const bombs = Math.floor(size ** 2 * percentage);
    return bombs;
  }, [appState.gameState.options.difficulty, appState.gameState.options.size]);

  useEffectDebugger((): void => {
    // Saves bomb count to state if it's a value > 1
    const bombsState = appState.gameStats.bombs;
    if (bombsState < 1) {
      const bombs = calculateBombs();
      if (bombs && bombs > 1) {
        appDispatch({
          type: "GAMESTATS_SET_BOMB_COUNT",
          payload: {
            bombs,
          },
        });
      }
    }
  }, [calculateBombs, appState.gameStats.bombs])

  /* --------------------------------------------------------------
    When a square is clicked, all nonbomb, nonhint squares clicked
  --------------------------------------------------------------- */

  const needsToBeClicked = React.useCallback((): string[] => {
    // Returns array of square key strings to be clicked
    const squares = appState.squares;
    const squaresArray = Object.keys(squares);
    const result: string[] = [];
    if (squaresArray.length > 1) {
      const toBeClicked = Object.entries(squares).filter((value) => {
        return (
          !value[1].adjacentBombCount
          && !value[1].clicked
          && !value[1].hint
        );
      });
      if (toBeClicked.length) {
        toBeClicked.forEach((subArray) => {
          result.push(subArray[0]);
        });
      }
    }
    return result;
  }, [appState.squares]);

  useEffectDebugger((): void => {
    /* If a neighbor has no adjacent bombs, hasn't been clicked or
    had its hint revealed, then mark it clicked */
    const squareKeys: string[] = needsToBeClicked();
    const gameReset: boolean = appState.gameState.gameReset;
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
      })
    }
  }, [needsToBeClicked, appState.gameState.gameReset]);

  /* -----------------------------------------------------------------------
    When a square is clicked, all nonbomb, nonclicked neighbors gain hints
  ------------------------------------------------------------------------ */

  const needsHint = React.useCallback((): string[] => {
    // Returns array of square key strings to be marked as hints
    const squares = appState.squares;
    const squaresArray = Object.keys(squares);
    const result: string[] = [];
    if (squaresArray.length > 1) {
      const toBeHinted = Object.entries(squares).filter((value) => {
        return (
          value[1].adjacentBombCount > 0
          && !value[1].clicked
          && !value[1].hint
        );
      });
      if (toBeHinted.length) {
        toBeHinted.forEach((subArray) => {
          result.push(subArray[0]);
        });
      }
    }
    return result;
  }, [appState.squares]);

  useEffectDebugger((): void => {
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
      })
    }
  }, [needsHint]);

  /* -----------------------------------------------------
    Set gameState values for a new game and init squares
  ----------------------------------------------------- */

  useEffectDebugger((): void => {
    let size: number;
    // Get options from local storage or default starting values
    const options = appState.gameState.options;
    const gameReset = appState.gameState.gameReset;
    if (options.size === -1 || options.difficulty === -1) {
      const progress = 0;

      let difficulty: number;
      let lives: number;
      // Read options from local storage
      const localStorageRef = localStorage.getItem("sweeper-options");
      if (localStorageRef) {
        const options = JSON.parse(localStorageRef);
        size = options.size;
        difficulty = options.difficulty;
        lives = options.lives;
      } else if (gameReset) {
        size = options.size;
      } else {
        // No local storage, set initial default values
        size = 10;
        difficulty = 2;
        lives = 2;
      }
      appDispatch({
        type: "GAME_INIT",
        payload: {
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

    const initialized = appState.gameState.initialized;
    if (!initialized && appState.gameState.options.size > 0) {
      initSquares(size);
    }
  }, [
    appState.gameState.initialized,
    appState.gameState.options,
    appState.gameStats.bombs,
    appState.squares,
  ]);

  const initSquares = (size: number): void => {
    const gameReset = appState.gameState.gameReset;
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
  };

  /* ---------------------------------------
    Mark squares that contain hidden bombs
  --------------------------------------- */

  const assignSquaresAsBombs = React.useCallback((
    positionArray: string[],
    count: number
  ): number => {
    const bombs: number = appState.gameStats.bombs;
    if (count > bombs - 1) {
      // Once positionArray has the number of bombs - 1 that we need, return
      appDispatch({
        type: "BOMB_POSITIONS_ASSIGNED",
        payload: {
          bombPositionsAssigned: true,
        }
      });
      return 1;
    }
    const size: number = appState.gameState.options.size;
    // Generate a random square key
    let tempPosition: string = `r${
      randomIntFromInterval(0, size - 1)
    }-s${
      randomIntFromInterval(0, size - 1)
    }`;

    /* Determine whether positionArray already contains tempPosition
    If it does, then discard it and generate a different tempPosition
    If it does not, then save it to positionArray */
    if (!positionArray.includes(tempPosition)) {
      positionArray.push(tempPosition);
      count += 1;
      appDispatch({
        type: "SQUARES_BOMB",
        key: tempPosition,
        payload: {
          bomb: true,
        },
      });
    }
    // If position was a dupe, count remains the same.
    assignSquaresAsBombs(positionArray, count);
  }, [appState.gameState.options.size, appState.gameStats.bombs]);

  useEffectDebugger((): void => {
    /* If a neighbor has an adjacent bomb, hasn't been clicked or
      had its hint revealed, then reveal its hint */
    const bombs = appState.gameStats.bombs;
    const squaresComplete = appState.gameState.squaresComplete;
    if (bombs && squaresComplete) {
      const positionArray: string[] = [];
      assignSquaresAsBombs(positionArray, 0);
    }
  }, [
    assignSquaresAsBombs,
    appState.gameStats.bombs,
    appState.gameState.squaresComplete
  ]);

  /* ------------------------
    Recover from game reset
  ------------------------ */

  useEffectDebugger((): void => {
    // Once bombs assigned, if the game was reset by the form, mark as false
    const gameReset = appState.gameState.gameReset;
    if (gameReset) {
      appDispatch({
        type: "GAME_RESET",
        payload: {
          gameReset: false,
        }
      });
      appDispatch({
      type: "SQUARES_INITIALIZED",
      payload: {
        initialized: false,
      },
    });
    }
  }, [appState.gameState.squaresComplete]);

  /* ---------------------------------------
    Form submitted, reset the game board
  --------------------------------------- */

  useEffectDebugger((): void => {
    /* If a neighbor has an adjacent bomb, hasn't been clicked or
    had its hint revealed, then reveal its hint */
    // Form submit triggers cleanup
    appDispatch({
      type: "GAME_RESET_CLEANUP",
      payload: {
        seed: randomIntFromInterval(1, 9999),
        bombs: -1,
        clickHistory: [],
        bombPositions: [],
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

  /* -------------------------------------------------------------------
    Prune excess square properties when game board shrinks after reset
  ------------------------------------------------------------------- */

  useEffectDebugger((): void => {
    const initialized = appState.gameState.initialized;
    const gameReset = appState.gameState.gameReset;
    if (initialized && gameReset) {
      const squares: SquaresType = appState.squares;
      const size: number = appState.gameState.options.size;

      // if (Object.keys(squares).length > 1) {
        let row: number = 0;
        let column: number = 0;
        Object.keys(squares).forEach((square: string) => {
          row = Number(square!.split("-")[0].match(/\d{1,3}/)[0]);
          column = Number(square!.split("-")[1].match(/(\d{1,3})/)[0]);
          /* Check to see if squares has any rows or columns greater
            than the board size - 1. If so, delete from state */
          if (row > size - 1 || column > size - 1) {
            appDispatch({
              type: "SQUARES_DELETE",
              key: square,
            });
          }
        });

        appDispatch({
          type: "SQUARES_PRUNED",
          payload: {
            squaresPruned: true,
          }
        });
      // }
    } else if (initialized && !gameReset) {
      // First game skips pruning step
      appDispatch({
        type: "SQUARES_PRUNED",
        payload: {
          squaresPruned: true,
        }
      });
    }
  }, [appState.gameState.initialized, appState.gameState.gameReset]);

  /* -------------------------------------------
    Assign default values to square properties
  ------------------------------------------- */

  useEffectDebugger((): void => {
    const initialized = appState.gameState.initialized;
    const squaresPruned = appState.gameState.squaresPruned;
    if (initialized && squaresPruned) {
      // const squares: SquaresType = appState.squares;
      const size: number = appState.gameState.options.size;

      for (let i = 0; i < size; i += 1) {
        for (let k = 0; k < size; k += 1) {
          appDispatch({
            type: "SQUARES_ADD",
            key: `r${i}-s${k}`,
            payload: {
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
          });
        }
      }
      appDispatch({
        type: "SQUARES_PRUNED",
        payload: {
          squaresPruned: false,
        }
      });
      appDispatch({
        type: "SQUARES_INIT_COMPLETE",
        payload: {
          squaresComplete: true,
        },
      });
    }
  }, [appState.gameState.initialized, appState.gameState.squaresPruned]);

  /* ****************
    Component Props
  **************** */

  // User submits form: Save Player's game board options
  const saveOptions = (obj: SizeDifficultyLives): void => {
    toggleScroll(true, "squareScroll");
    // Apply submitted data to state
    appDispatch({
      type: "GAME_INIT",
      payload: {
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
      }
    });
    // Save user selection to local storage
    localStorage.setItem("sweeper-options", JSON.stringify(obj));
  };

  // Prop for squares to update squareScroll state
  const toggleScroll = (bool: boolean, anim: string): void => {
    appDispatch({
      type: "FORM_TOGGLE_SQUARESCROLL",
      payload: {
        [anim]: bool,
      },
    });
  };

  // Prop function for stats to pass to global state
  const revealTarget = (totalToReveal: number): void => {
    const totalToRevealState: number = appState.gameStats.totalToReveal;
    if (
      (totalToReveal > 0 && totalToRevealState <= 0) ||
      totalToReveal !== totalToRevealState
    ) {
      // stats.totalToReveal = totalToReveal;
      appDispatch({
        type: "GAMESTATS_UPDATE_TOTALTOREVEAL",
        payload: {
          totalToReveal,
        },
      });
    }
  };

  // Prop to toggle state when mode buttons are clicked (flag, question mark)
  const onModeClick = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // 1. From State
    const modes: ModesType = appState.modes;
    // 2. Change setting
    modes[(e.target as HTMLFormElement).name] = !modes[
      (e.target as HTMLFormElement).name
    ];
    // 3. If mode X toggles to true, then make sure mode Y is false
    if (
      "flagMode" === (e.target as HTMLFormElement).name &&
      modes[(e.target as HTMLFormElement).name]
    ) {
      modes.questionMode = false;
    } else if (
      "questionMode" === (e.target as HTMLFormElement).name &&
      modes[(e.target as HTMLFormElement).name]
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

  // Prop for Square component when clicking on a bomb square
  const explode = (squareKey: string): void => {
    console.log("explode");
    let squares: SquaresType = appState.squares;
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

  // Cleanup bombMode, resetting bomb square, reset bombNotice, and remove disabled from clickable squares
  const explodeCleanup = (squareKey: string): void => {
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
      const progress = appState.gameState.progress;
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

        const modal = appState.modal;
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

  // Prop for Square component when clicking on a square
  const onSquareClick = (squareKey: string): void => {
    // 1. Copy state
    const squares: SquaresType = appState.squares;
    const gameStats: GameStats = appState.gameStats;
    let flags: number = gameStats.flags;
    let questions: number = gameStats.questions;
    let revealed: number = gameStats.revealed;
    const totalToReveal: number = gameStats.totalToReveal;

    const modes: ModesType = appState.modes;
    const bomb: boolean = squares[squareKey].bomb;
    const flagMode: boolean = modes.flagMode;
    const questionMode: boolean = modes.questionMode;
    let flagged: boolean;
    let questionMarked;

    if (modes.newGame) {
      appDispatch({
        type: "TOGGLE_NEWGAME",
        payload: {
          newGame: false,
        },
      });
    }

    // 2. Update square
    if (flagMode) {
      // If marking a flag is active, then mark only that square and then save to state
      flagged = !squares[squareKey].flagged;
      if (flagged) {
        // If a flag is placed, increment the flag count
        flags += 1;
      } else {
        // If a flag is removed, decrement the flag count
        flags -= 1;
      }
      appDispatch({
        type: "FLAGGED_FLAG_COUNT",
        key: squareKey,
        payload: {
          flags,
          flagged,
        },
      });
      if (squares[squareKey].questionMarked) {
        // If the square is question marked when placing a flag, remove questionMarked
        questionMarked = !squares[squareKey].questionMarked;
        appDispatch({
          type: "QUESTIONMARKED",
          key: squareKey,
          payload: {
            questionMarked,
          },
        });
      }
    } else if (questionMode) {
      /* If placing a question mark is active, then mark only that square
      and then save to state */
      questionMarked = !squares[squareKey].questionMarked;
      if (questionMarked) {
        // If a question mark is placed, increment the question mark count
        questions += 1;
      } else {
        // If a question mark is removed, decrement the question mark count
        questions -= 1;
      }
      appDispatch({
        type: "QUESTIONMARKED_QS_COUNT",
        key: squareKey,
        payload: {
          questions,
          questionMarked,
        },
      });
      if (squares[squareKey].flagged) {
        // If the square is flagged when placing a question mark, unflag it
        flagged = !squares[squareKey].flagged;
        appDispatch({
          type: "FLAGGED",
          key: squareKey,
          payload: {
            flagged,
          },
        });
      }
    } else {
      // Mark as clicked and evaluate whether it's a bomb
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
          const modal = appState.modal;
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
            console.log("Reveal the board")
            if (!squares[key].clicked) {
              // Reveal the board
              appDispatch({
                type: "SQUARE_CLICKED",
                key: key,
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
          console.log("Defeated")
          Object.keys(squares).forEach((key) => {
            if (!squares[key].clicked) {
              // Reveal the board when you lose
              appDispatch({
                type: "SQUARE_CLICKED",
                key: key,
                payload: {
                  clicked: true,
                },
              });
              if (squares[key].bomb) {
                // Trigger all bombs to play their explosion animation
                appDispatch({
                  type: "EXPLODE_TRIGGER",
                  key: key,
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

  const modalShow = () => {
    let isVisible: boolean = appState.modal.isVisible;
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

  const modalClose = (): boolean => {
    let isVisible: boolean = appState.modal.isVisible;
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
    const progress: number = appState.gameState.progress;
    if (progress === 1) {
      // Win message
      return "Congrats, You Won!";
    } else if (progress === -1) {
      // Defeat message
      return "You Lost!";
    }
    return "Customize Settings";
  };

  const modalSettingsButtonText = (): string => {
    const progress: number = appState.gameState.progress;
    const modalCleanup: boolean = appState.modal.modalCleanup;
    if (progress !== 0 && modalCleanup) {
      return "Play Again?";
    }
    return "Customize Settings";
  };

  const renderModal = (): JSX.Element => {
    const isVisible: boolean = appState.modal.isVisible;
    const gameState: GameState = appState.gameState;
    if (isVisible) {
      return (
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
    return;
  };

  const columns = [];
  let columnKey: string;
  for (let i = 0; i < appState.gameState.options.size; i++) {
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
      />
    );
  }

  return (
    <div>
      <Header />
      <div className="game-board container">
        <div>{renderModal()}</div>
        <div className="game-body row">
          <div className="col-3">
            <button className="btn btn-secondary buttons" onClick={modalShow}>
              {modalSettingsButtonText()}
            </button>
            <Notice notices={appState.notices} />
            <Stats
              stats={appState.gameStats}
              options={appState.gameState.options}
              revealTarget={revealTarget}
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
