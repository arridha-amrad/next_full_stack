import { createContext, FC, ReactNode, useContext, useReducer } from "react";
import appReducer, { initialState } from "./appReducer";
import { IDispatch, IState } from "./IContext";

const AppContext = createContext<
   | {
        state: IState;
        dispatch: IDispatch;
     }
   | undefined
>(undefined);

interface Props {
   children: ReactNode;
}

const AppProvider: FC<Props> = ({ children }) => {
   const [state, dispatch] = useReducer(appReducer, initialState);
   return (
      <AppContext.Provider value={{ state, dispatch }}>
         {children}
      </AppContext.Provider>
   );
};
export default AppProvider;

export const useAppContext = () => {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("useAppContext must be used inside AppProvider");
   }
   return context;
};
