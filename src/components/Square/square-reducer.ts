import squareInit from "./square-init";
import { SquareAction, SquarePd } from "../../types";

const squareReducer = (state: typeof squareInit, action: SquareAction): SquarePd => {
  switch (action.type) {
    case "SQUARE_ALL_VALUES":
      return {
        ...state,
        bombAnimIsPlaying: action.payload.bombAnimIsPlaying,
        fireAnimIsPlaying: action.payload.fireAnimIsPlaying,
      };
    case "SQUARE_SET_BOMB_ANIM":
      return {
        ...state,
        bombAnimIsPlaying: action.payload.bombAnimIsPlaying,
      };
    case "SQUARE_SET_FIRE_ANIM":
      return {
        ...state,
        fireAnimIsPlaying: action.payload.fireAnimIsPlaying,
      };
    default:
      throw new Error();
  }
};

export default squareReducer;
