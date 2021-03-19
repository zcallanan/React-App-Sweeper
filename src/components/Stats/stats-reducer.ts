import statsInit from "./stats-init";
import { StatsAction } from "../../types";

const statsReducer = (state: typeof statsInit, action: StatsAction) => {
  switch (action.type) {
    case "STATS_INIT_VALUES":
      return {
        size: action.payload.size,
        bombs: action.payload.bombs,
        totalToReveal: action.payload.totalToReveal,
      };
    case "STATS_SET_SIZE":
    return {
      ...state,
      size: action.payload.size,
    };
    case "STATS_SET_BOMBS":
    return {
      ...state,
      bombs: action.payload.bombs,
    };
    case "STATS_SET_TOTALTOREVEAL":
    return {
      ...state,
      totalToReveal: action.payload.totalToReveal,
    };
    default:
      throw new Error();
  }
};

export default statsReducer;
