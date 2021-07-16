import React, { ComponentType, ReactElement, Suspense } from "react";
import { Router, Link } from "@reach/router";
import Loadable, { LoadableComponent } from "react-loadable";
import LoadableVisibility from "react-loadable-visibility/react-loadable";

function Load() {
  return <div>Loading</div>;
}

interface HomeProps {
  path: string;
}

function Home({ path }: HomeProps): ReactElement {
  // const Lazy1: React.ComponentType<unknown> & Loadable.LoadableComponent =
  //   Loadable({
  //     loader: () => import("../layouts/Lazy1"),
  //     loading: Load,
  //   });
  // const Lazy2: React.ComponentType<unknown> & Loadable.LoadableComponent =
  //   LoadableVisibility({
  //     loader: () => import("../layouts/Lazy2"),
  //     loading: Load,
  //   });
  return (
    <div>
      Home!
      {/* <Lazy1></Lazy1>
      <div style={{ height: 5000 }}></div>
      {/* With Visibility
      <Lazy2></Lazy2> */}
    </div>
  );
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
      <h2 className="text-gray-50">Hello World!</h2>
      <Router>
        <Home path="/" />
        <About path="/about" />
      </Router>
    </div>
  );
}
