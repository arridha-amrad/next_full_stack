import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
   return (
      <QueryClientProvider client={queryClient}>
         <Component {...pageProps} />
         <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
   );
}

export default MyApp;
