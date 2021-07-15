import React from "react";
import { Router, Link } from "@reach/router";

interface HomeProps {
  path: string;
}

function Home({ path }: HomeProps): React.ReactElement {
  return <h1>Home</h1>;
}

function About({ path }: HomeProps): React.ReactElement {
  return <h1>About</h1>;
}

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="about">Dashboard</Link>
      </nav>
      <h2 className="text-gray-50">conoha!</h2>
      <Router>
        <Home path="/" />
        <About path="/about" />
      </Router>
    </div>
  );
}
