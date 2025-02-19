import { useEffect, useMemo } from "react";
import type { AppProps } from "next/dist/shared/lib/router/app";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    console.log("Booking Microfrontend Loaded");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <title>Taly Booking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Booking system for company management"
        />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;
