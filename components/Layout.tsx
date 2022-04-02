import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
  mainClass?: string;
};

const Layout = ({ children, title = "Whatstyle", mainClass = "" }: Props) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="author" content="Harmen Janssen" />
        <meta name="theme-color" content="#ff336d" />
        <meta
          name="description"
          content="Harmen Janssen has been a web developer for a million years, and still thinks naming things is the hardest problem in computing."
        />
        <link rel="favicon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>{title}</title>
      </Head>
      <div className="container">
        <header role="banner">
          <Link href="/">
            <a>Whatstyle.</a>
          </Link>
        </header>
        <main role="main" className={mainClass}>
          {children}
        </main>
        <footer className="main-footer">
          &copy; Harmen Janssen, but I allow stealing.
        </footer>
      </div>
    </>
  );
};

export default Layout;
