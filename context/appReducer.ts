import { ActionTypes, IState } from "./contextTypes";

export const initialState: IState = {
   todos: [],
   token: "",
   user: null,
};

export const appReducer = (state = initialState, action: ActionTypes): IState => {
   switch (action.type) {
      case "ADD_TODO":
         return {
            ...state,
            todos: {
               ...state.todos,
               ...action.payload,
            },
         };
      case "SET_USER":
         return {
            ...state,
            user: action.payload,
         };
      case "SET_TOKEN":
         return {
            ...state,
            token: action.payload,
         };
      case "LOGOUT":
         return {
            ...state,
            todos: [],
            token: "",
            user: null,
         };
      default:
         return state;
   }
};
