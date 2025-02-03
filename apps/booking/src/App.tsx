import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		console.log("Booking Microfrontend Loaded");
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<Head>
				<title>Taly Booking</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta
					name="description"
					content="Booking system for salon management"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Component {...pageProps} />
			<Toaster position="top-right" />
		</QueryClientProvider>
	);
}

export default App;
