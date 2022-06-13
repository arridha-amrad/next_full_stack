import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import AppProvider from "../context/appContext";
import { Suspense } from "react";
import MySpinner from "../components/MySpinner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback={<MySpinner />}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </Suspense>
  );
}

export default MyApp;
