import formInit from "./form-init";
import { FormAction, FormPd } from "../../types";

const formReducer = (state: typeof formInit, action: FormAction): FormPd => {
  switch (action.type) {
    case "FORM_INIT_VALUES":
      return {
        ...state,
        size: action.payload.size,
        difficulty: action.payload.difficulty,
        lives: action.payload.lives,
      };
    case "FORM_SET_SIZE":
      return {
        ...state,
        size: action.payload.size,
      };
    case "FORM_SET_DIFFICULTY":
      return {
        ...state,
        difficulty: action.payload.difficulty,
      };
    case "FORM_SET_LIVES":
      return {
        ...state,
        lives: action.payload.lives,
      };
    case "FORM_SET_ERROR":
      return {
        ...state,
        errorString: action.payload.errorString,
      };
    default:
      throw new Error();
  }
};

export default formReducer;
