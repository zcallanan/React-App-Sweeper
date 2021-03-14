import React, { useReducer, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { StatsType, OptionType } from "../types";

interface Props {
  stats: StatsType;
  options: OptionType;
  revealTarget: (totalToReveal: number) => void;
}

const Stats = ({ stats, options, revealTarget }: Props): JSX.Element => {
  // Reducer
  const statsReducer = (state, action) => {
    switch (action.type) {
      case "INITVALUES":
        return {
          size: action.payload.size,
          bombs: action.payload.bombs,
          totalToReveal: action.payload.totalToReveal,
        };
      case "SETSIZE":
      return {
        ...state,
        size: action.payload.size,
      };
      case "SETBOMBS":
      return {
        ...state,
        bombs: action.payload.bombs,
      };
      case "SETTOTALTOREVEAL":
      return {
        ...state,
        totalToReveal: action.payload.totalToReveal,
      };
      default:
        throw new Error();
    }
  };

  // Initial values
  const initialVals = {
    size: -1,
    bombs: -1,
    totalToReveal: -1,
  };

  // Manage state
  const [statsState, statsDispatch] = useReducer(
    statsReducer,
    initialVals,
  );

  useEffect(() => {
    const bombsProps: number = stats.bombs;
    const bombsState: number = statsState.bombs;
    const totalToRevealState: number = statsState.totalToReveal;
    const sizeProps: number = options.size;
    const sizeState: number = statsState.size;
    const currentTotalToReveal: number = options.size ** 2 - bombsProps;
    if (bombsProps > 0 && sizeProps > 0 && totalToRevealState < 0) {
      // Save initial values to state
      statsDispatch({
        type: "INITVALUES",
        payload: {
          bombs: bombsProps,
          size: sizeProps,
          totalToReveal: currentTotalToReveal,
        },
      });
    } else if (
      bombsProps > 0
      && sizeProps > 0
      && totalToRevealState > 0
      && totalToRevealState !== currentTotalToReveal
      && sizeProps === sizeState
      && bombsProps !== bombsState
    ) {
      statsDispatch({
        type: "SETTOTALTOREVEAL",
        payload: {
          totalToReveal: currentTotalToReveal,
        },
      });
    }
    if (
      (sizeState < 0 || sizeState !== sizeProps)
      && sizeProps > 0
    ) {
      statsDispatch({
        type: "SETSIZE",
        payload: {
          size: sizeProps,
        },
      });
    }
    if ((bombsState < 0 || bombsState !== bombsProps) && bombsProps > 0) {
      statsDispatch({
        type: "SETBOMBS",
        payload: {
          bombs: bombsProps,
        },
      });
    }
    revealTarget(totalToRevealState);
  }, [stats,
    options,
    revealTarget,
    statsState.bombs,
    statsState.size,
    statsState.totalToReveal,
  ]);

  const renderLives = (): JSX.Element => {
    const statsProps = stats;
    const currentLives = statsProps.currentLives;
    let life = "Lives:";
    if (currentLives === 1) {
      life = "Life:";
    }
    // Avoid display of stats before currentLives is set
    if (currentLives >= 0) {
      return (
        <tr key="lifeCount">
          <td>{life}</td>
          <td>
            <TransitionGroup component="span" className="lives">
              <CSSTransition
                classNames="lives"
                key={currentLives}
                timeout={{ enter: 3000, exit: 3000 }}
              >
                <span>{currentLives}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderBombCount = (): JSX.Element => {
    const statsProps: StatsType = stats;
    const bombs = statsProps.bombs;
    if (bombs >= 0) {
      return (
        <tr key="bombs">
          <td>Hidden Bombs:</td>
          <td>
            <TransitionGroup component="span" className="bombs">
              <CSSTransition
                classNames="bombs"
                key={bombs}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{bombs}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderRevealed = (): JSX.Element => {
    const statsProps: StatsType = stats;
    const revealed = statsProps.revealed;
    const totalToReveal = statsState.totalToReveal;

    if (revealed >= 0 && totalToReveal >= 0) {
      return (
        <tr key="revealed">
          <td>Squares Revealed: </td>
          <td>
            <TransitionGroup component="span" className="revealed">
              <CSSTransition
                classNames="revealed"
                key={revealed}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{revealed}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
          <td>/</td>
          <td>
            <TransitionGroup component="span" className="total-to-reveal">
              <CSSTransition
                classNames="total-to-reveal"
                key={totalToReveal}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{totalToReveal}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderFlagCount = (): JSX.Element => {
    const statsProps: StatsType = stats;
    const flags = statsProps.flags;
    let flagText = "Bombs Flagged:";
    if (flags === 1) {
      flagText = "Bomb Flagged:";
    }
    if (flags >= 0) {
      return (
        <tr key="flags">
          <td>{flagText}</td>
          <td>
            <TransitionGroup component="span" className="flags">
              <CSSTransition
                classNames="flags"
                key={flags}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{flags}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderQuestionsCount = (): JSX.Element => {
    const statsProps: StatsType = stats;
    const questions = statsProps.questions;
    if (questions >= 0) {
      return (
        <tr key="questions">
          <td>Marked Unknown:</td>
          <td>
            <TransitionGroup component="span" className="questions">
              <CSSTransition
                classNames="questions"
                key={questions}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{questions}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="stats-wrapper">
      <h3 className="stats-title">Stats</h3>
      <table>
        <tbody>
          {renderLives()}
          {renderBombCount()}
          {renderRevealed()}
          {renderFlagCount()}
          {renderQuestionsCount()}
        </tbody>
      </table>
    </div>
  );
}

// class Stats extends React.Component<Props, State> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       localStats: {
//         size: -1,
//         bombs: -1,
//         totalToReveal: -1,
//       },
//     };
//   }


//   componentDidUpdate() {
//     const stats: StatsType = this.props.stats;
//     const bombs: number = stats.bombs;
//     const localStats: OtherStatsType = { ...this.state.localStats };
//     const options: OptionType = this.props.options;
//     const totalToReveal: number = options.size ** 2 - bombs;
//     if (bombs > 0 && options.size > 0 && localStats.totalToReveal < 0) {
//       localStats.totalToReveal = options.size ** 2 - bombs;
//       if (localStats.totalToReveal > 0) {
//         this.setState({ localStats });
//       }
//     } else if (
//       bombs > 0 &&
//       options.size > 0 &&
//       localStats.totalToReveal !== totalToReveal &&
//       options.size === localStats.size &&
//       bombs !== localStats.bombs
//     ) {
//       localStats.totalToReveal = options.size ** 2 - bombs;
//       if (localStats.totalToReveal > 0) {
//         this.setState({ localStats });
//       }
//     }
//     if (
//       (localStats.size < 0 || localStats.size !== options.size) &&
//       options.size > 0
//     ) {
//       // Save local size
//       localStats.size = options.size;
//       if (localStats.size > 0) {
//         this.setState({ localStats });
//       }
//     }
//     if ((localStats.bombs < 0 || localStats.bombs !== bombs) && bombs > 0) {
//       // Set local bombs
//       localStats.bombs = bombs;
//       if (localStats.bombs > 0) {
//         this.setState({ localStats });
//       }
//     }
//     this.props.revealTarget(localStats.totalToReveal);
//   }

//   protected renderLives = (): JSX.Element => {
//     const stats = this.props.stats;
//     const currentLives = stats.currentLives;
//     let life = "Lives:";
//     if (currentLives === 1) {
//       life = "Life:";
//     }
//     // Avoid display of stats before currentLives is set
//     if (currentLives >= 0) {
//       return (
//         <tr key="lifeCount">
//           <td>{life}</td>
//           <td>
//             <TransitionGroup component="span" className="lives">
//               <CSSTransition
//                 classNames="lives"
//                 key={currentLives}
//                 timeout={{ enter: 3000, exit: 3000 }}
//               >
//                 <span>{currentLives}</span>
//               </CSSTransition>
//             </TransitionGroup>
//           </td>
//         </tr>
//       );
//     }
//   };

//   protected renderBombCount = (): JSX.Element => {
//     const stats: StatsType = this.props.stats;
//     const bombs = stats.bombs;
//     if (bombs >= 0) {
//       return (
//         <tr key="bombs">
//           <td>Hidden Bombs:</td>
//           <td>
//             <TransitionGroup component="span" className="bombs">
//               <CSSTransition
//                 classNames="bombs"
//                 key={bombs}
//                 timeout={{ enter: 1500, exit: 1500 }}
//               >
//                 <span>{bombs}</span>
//               </CSSTransition>
//             </TransitionGroup>
//           </td>
//         </tr>
//       );
//     }
//   };

//   protected renderRevealed = (): JSX.Element => {
//     const stats: StatsType = this.props.stats;
//     const revealed = stats.revealed;
//     const localStats = { ...this.state.localStats };
//     const totalToReveal = localStats.totalToReveal;

//     if (revealed >= 0 && totalToReveal >= 0) {
//       return (
//         <tr key="revealed">
//           <td>Squares Revealed: </td>
//           <td>
//             <TransitionGroup component="span" className="revealed">
//               <CSSTransition
//                 classNames="revealed"
//                 key={revealed}
//                 timeout={{ enter: 1500, exit: 1500 }}
//               >
//                 <span>{revealed}</span>
//               </CSSTransition>
//             </TransitionGroup>
//           </td>
//           <td>/</td>
//           <td>
//             <TransitionGroup component="span" className="total-to-reveal">
//               <CSSTransition
//                 classNames="total-to-reveal"
//                 key={totalToReveal}
//                 timeout={{ enter: 1500, exit: 1500 }}
//               >
//                 <span>{totalToReveal}</span>
//               </CSSTransition>
//             </TransitionGroup>
//           </td>
//         </tr>
//       );
//     }
//   };

//   protected renderFlagCount = (): JSX.Element => {
//     const stats: StatsType = this.props.stats;
//     const flags = stats.flags;
//     let flagText = "Bombs Flagged:";
//     if (flags === 1) {
//       flagText = "Bomb Flagged:";
//     }
//     if (flags >= 0) {
//       return (
//         <tr key="flags">
//           <td>{flagText}</td>
//           <td>
//             <TransitionGroup component="span" className="flags">
//               <CSSTransition
//                 classNames="flags"
//                 key={flags}
//                 timeout={{ enter: 1500, exit: 1500 }}
//               >
//                 <span>{flags}</span>
//               </CSSTransition>
//             </TransitionGroup>
//           </td>
//         </tr>
//       );
//     }
//   };

//   protected renderQuestionsCount = (): JSX.Element => {
//     const stats: StatsType = this.props.stats;
//     const questions = stats.questions;
//     if (questions >= 0) {
//       return (
//         <tr key="questions">
//           <td>Marked Unknown:</td>
//           <td>
//             <TransitionGroup component="span" className="questions">
//               <CSSTransition
//                 classNames="questions"
//                 key={questions}
//                 timeout={{ enter: 1500, exit: 1500 }}
//               >
//                 <span>{questions}</span>
//               </CSSTransition>
//             </TransitionGroup>
//           </td>
//         </tr>
//       );
//     }
//   };

//   render() {
//     return (
//       <div className="stats-wrapper">
//         <h3 className="stats-title">Stats</h3>
//         <table>
//           <tbody>
//             {this.renderLives()}
//             {this.renderBombCount()}
//             {this.renderRevealed()}
//             {this.renderFlagCount()}
//             {this.renderQuestionsCount()}
//           </tbody>
//         </table>
//       </div>
//     );
//   }
// }

export default Stats;
