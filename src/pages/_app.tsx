import Layout from "@/components/Layout";
import { store } from "@/store";
import { theme } from "@/utils/theme";
import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import "./global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Foodie App</title>
      </Head>
      <SessionProvider>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Layout>
              <Component />
            </Layout>
          </ThemeProvider>
        </Provider>
      </SessionProvider>
    </>
  );
}
