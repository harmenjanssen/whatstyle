import { AppProps } from "next/app";

import "../styles/globals.css";
import main from "../scripts/main.js";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    main();
  });
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
