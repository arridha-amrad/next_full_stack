import { createContext, ReactNode, useContext, useReducer } from "react";
import { appReducer, initialState } from "./appReducer";
import { Dispatch, IState } from "./contextTypes";

const AppContext = createContext<
   | {
        state: IState;
        dispatch: Dispatch;
     }
   | undefined
>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
   const [state, dispatch] = useReducer(appReducer, initialState);
   return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useMyApp = () => {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("useMyApp context must be used inside AppContextProvider");
   }
   return context;
};
