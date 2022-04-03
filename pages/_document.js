import { Html, Head, Main, NextScript } from "next/document";

/**
 * This override is here to add the lang attribute to the html tag.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
