import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import AppProvider from "../context/appContext";
import { Suspense } from "react";
import MySpinner from "../components/MySpinner";
import { store } from "../app/store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
