import Link from "next/link";
import Layout from "../components/Layout";
import Codepen from "../components/social/Codepen";
import Github from "../components/social/Github";
import Goodreads from "../components/social/Goodreads";
import Instagram from "../components/social/Instagram";
import Lastfm from "../components/social/Lastfm";
import LinkedIn from "../components/social/LinkedIn";
import Twitter from "../components/social/Twitter";

const IndexPage = () => (
  <Layout
    mainClass="home"
    title="Whatstyle, online home of web developer Harmen Janssen"
  >
    <h1>Hi!</h1>
    <p>
      I'm <strong>Harmen Janssen</strong>. I've been making websites for well
      over a decade.
      <br />
      At the moment I'm making these websites at{" "}
      <a href="https://grrr.nl">GRRR</a>, a great agency for Meaningful Matters,
      where I'm leading the development team.
    </p>

    <p>
      I'm passionate about <strong>sports</strong>, <strong>cooking</strong>,{" "}
      <strong>music</strong>, <strong>the JAMStack</strong>,{" "}
      <strong>functional programming</strong>, and{" "}
      <strong>inclusive design</strong>.
    </p>
    <p>
      <Link href="/articles">
        <a>I used to run a blog</a>
      </Link>
      , but would recommend <a href="https://grrr.tech">GRRR's Tech blog</a>{" "}
      where I do most of my writing these days.
    </p>

    <aside>
      <h2>Elsewhere:</h2>

      <nav className="social-links">
        <ul aria-label="Links to Harmen on social media">
          <li>
            <Github />
          </li>
          <li>
            <Twitter />
          </li>
          <li>
            <Lastfm />
          </li>
          <li>
            <Codepen />
          </li>
          <li>
            <Goodreads />
          </li>
          <li>
            <Instagram />
          </li>
          <li>
            <LinkedIn />
          </li>
        </ul>
      </nav>
    </aside>
  </Layout>
);

export default IndexPage;
