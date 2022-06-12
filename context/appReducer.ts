import { ActionTypes } from "./actionTypes";
import { IState } from "./IContext";

export const initialState: IState = {
   user: null,
};

const appReducer = (state = initialState, action: ActionTypes) => {
   switch (action.type) {
      case "SET_USER":
         return {
            ...state,
            user: action.payload,
         };
      case "UNSET_USER":
         return {
            ...state,
            user: null,
         };
      default:
         return state;
   }
};

export default appReducer;
