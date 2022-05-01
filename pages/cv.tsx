import Layout from "../components/Layout";

const CvPage = () => (
  <Layout title="Curriculum Vitae of Harmen Janssen">
    <h1>Curriculum Vitae</h1>

    <h2>Personal</h2>

    <img src="/images/harmen.jpeg" alt="Harmen Janssen" className="my-face" />

    <dl>
      <dt>Name</dt>
      <dd>Harmen Janssen</dd>

      <dt>Date of birth</dt>
      <dd>11 February 1985</dd>

      <dt>Location</dt>
      <dd>Harderwijk, The Netherlands</dd>
    </dl>

    <h2>Work experience</h2>

    <dl className="work-experience">
      <dt>2021 +</dt>
      <dd>
        <span className="work-experience__role">Tech lead</span>{" "}
        <span className="sr-only">at</span>{" "}
        <a href="https://grrr.nl">GRRR Creative Digital Agency</a>
      </dd>

      <dt>2008 - 2021</dt>
      <dd>
        <span className="work-experience__role">Senior web developer</span>
        <span className="sr-only">at</span>{" "}
        <a href="https://grrr.nl">GRRR Creative Digital Agency</a>
      </dd>

      <dt>2007 - 2008</dt>
      <dd>
        <span className="work-experience__role">Full-stack developer</span>
        <span className="sr-only">at</span>{" "}
        <a href="https://dutchinternetworks.nl/">Dutch Internet Works</a>
      </dd>

      <dt>2006 - 2007</dt>
      <dd>
        <span className="work-experience__role">Freelance web developer</span>
      </dd>
    </dl>

    <h2>Education</h2>

    <dl>
      <dt>2003 - 2006</dt>
      <dd>Eindhovense School, Multimedia Design</dd>
    </dl>

    <h2>Skills</h2>

    <ul>
      <li>
        I write high quality PHP code. I focus on maintainability and
        testability. I'm knowledgable about best practices like the SOLID
        principles, Gang of Four design patterns and Domain-Driven Design.
      </li>
      <li>
        I have a lot of experience planning small and large web applications and
        their architecture. I can account for scale, but can also be pragmatic.
        I have the experience to know when to apply both.
      </li>
      <li>
        I lead a growing team of developers. I coach their personal development
        and I'm a sparring partner to solve day-to-day technical problems.
      </li>
      <li>
        As tech lead I'm responsible for setting the course of the company's
        overall technical output. I ensure the team's technical choices are
        aligned with that strategy.
      </li>
      <li>
        I'm a proficient (technical) writer. I'm able to explain complex
        technical topics in documentation and blog posts. For a sampling, see{" "}
        <a href="https://grrr.tech/authors/harmen-janssen/">
          my writing on the GRRR Tech blog.
        </a>
      </li>
      <li>
        I have solid experience with all of the three different front-end
        technologies; HTML, CSS and JavaScript. I know their distinct domains
        and the way they interact with one another.
      </li>
      <li>
        Next to object-oriented programming I've studied functional programming
        in JavaScript and Haskell. I've created{" "}
        <a href="https://github.com/grrr-amsterdam/garp-functional">
          a library bringing functional programming paradigms to PHP
        </a>
        .
      </li>
      <li>
        I have a general interest in programming languages, and am able to
        quickly pick up new ones.
      </li>
      <li>
        I have a decent understanding of accessibility, and I'm very motivated
        to put out accessible front-end code. I consider inclusivity to be an
        important value.
      </li>
      <li>
        I have a solid understanding of Git. On numerous occasions, I have
        helped teammates who ran into trouble. I've formulated our general Git
        workflow, given multiple internal presentations and have written
        multiple articles on the subject.
      </li>
      <li>
        I have successfully divided applications into microservice-based
        architectures. This has given me a good understanding of the AWS
        landscape and I'm experienced in various AWS services, such as Lambda,
        APIGateway, DynamoDb and others.
      </li>
      <li>
        I've completely refactored a large legacy codebase into a modern Laravel
        application.
      </li>
    </ul>

    <h2>Personal interests</h2>

    <ul>
      <li>I'm a father of a pretty cool boy and girl.</li>
      <li>
        I'm an experienced amateur cook. I take cooking very seriously and
        strive to really understand the techniques. When I'm totally exhausted
        or stressed, cooking lifts me up.
      </li>
      <li>
        I love doing sports. I'm into weight training, kickboxing, and running.
        If I wasn't suffering from osteoarthritis of the knee, I would probably
        be playing basketball a lot.
      </li>
      <li>I read quite a lot of books.</li>
      <li>
        I like bird watching. Being out in nature and searching for birds calms
        me down. 🪶
      </li>
    </ul>
  </Layout>
);

export default CvPage;
