import ReactDOMServer from "react-dom/server";
import express from "express";
import { ServerLocation } from "@reach/router"
import App from "./app/components/App";
import fs from 'fs';
const app: express.Application = express();
const port: number = 3000;

app.use("/", express.static("dist"));

app.get("*", async (req: express.Request, res: express.Response) => {
  const app: string = ReactDOMServer.renderToString(
    <ServerLocation url={req.url}>
      <App />
    </ServerLocation>
  );
  try {
    const fileBuffer: Buffer = await fs.promises.readFile('test.html');
    const html: string = fileBuffer.toString();
    return res.send(
      html.replace('<main id="root"></main>', `<main id="root">${app}</main>`)
    );
  } catch (err) {
    return res.status(503).send(err)
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
