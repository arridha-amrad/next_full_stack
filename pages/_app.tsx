import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContextProvider } from "../context/appContext";

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <AppContextProvider>
         <Component {...pageProps} />
      </AppContextProvider>
   );
}

export default MyApp;
