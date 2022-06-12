import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import AppProvider from "../context/appContext";

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <AppProvider>
         <Component {...pageProps} />
      </AppProvider>
   );
}

export default MyApp;
