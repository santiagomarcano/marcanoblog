import React, { ReactElement, useEffect } from "react";

async function loadRevealJS(id: string) {
  let modules = await Promise.all([
    import("reveal.js"),
    import("reveal.js/plugin/markdown/markdown.esm.js"),
  ]);
  const parsedModules = modules.map((module) => module.default);
  const [Reveal, Markdown] = parsedModules;
  console.log("Selector is", `deck-${id}`);
  let deck = new Reveal(document.querySelector(`.deck-${id}`), {
    embedded: true,
    keyboardCondition: "focused",
    plugins: [
      Markdown
    ]
  });
  deck.initialize();
}

interface SlidesProps {
  id: string;
}

export default function Slides({ id }: SlidesProps): ReactElement {
  useEffect(() => {
    loadRevealJS(id);
  }, []);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
        <div class="reveal deck-${id}" style="height: 300px">
        <div class="slides">
        <section data-auto-animate>
          <div style="display: flex; justify-content: space-evenly; position: relative;">
            <div data-id="box" style="background: salmon; width: 50px; height: 50px;"></div>
            <div data-id="box" style="background: green; width: 50px; height: 50px;"></div>
            <div data-id="box" style="background: yellow; width: 50px; height: 50px;"></div>
          </div>
        </section>
        <section data-auto-animate>
          <div style="display: flex; justify-content: space-evenly; position: relative;">
            <div data-id="box" style="position: absolute; background: salmon; right: 0; width: 50px; height: 50px;"></div>
            <div data-id="box" style="position: absolute; background: green; top: 0; width: 50px; height: 50px;"></div>
            <div data-id="box" style="position: absolute; background: yellow; left: 0; width: 50px; height: 50px;"></div>
          </div>
        </section>
        </div>
      </div>
    `,
      }}
    ></div>
  );
}
