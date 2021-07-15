import ReactDOMServer from "react-dom/server";
import express, { Application, Request, Response } from "express";
import { ServerLocation } from "@reach/router";
import App from "./app/components/App";
import fs from "fs";
import path from "path";
import { injectHRClient } from "../HotReloadPlugin";
import { get, set } from "./redis";

const app: Application = express();

app.use("/", express.static("dist"));
app.use(
  injectHRClient({
    port: Number(process.env.PORT) + 1,
    cdn: {
      url: process.env.SOCKET_IO_CDN_URL,
      integrity: process.env.SOCKET_IO_CDN_INTEGRITY,
    },
  })
);

app.get("*", async (req: Request, res: Response) => {
  const app: string = ReactDOMServer.renderToString(
    <ServerLocation url={req.url}>
      <App />
    </ServerLocation>
  );
  try {
    // Cache policy for production
    if (process.env.NODE_ENV === "production") {
      const page = await get(req.url);
      if (page) {
        return res.send(page);
      }
    }
    const fileBuffer: Buffer = await fs.promises.readFile(
      path.join(__dirname, "../", "public", "index.html")
    );
    let html: string = String(fileBuffer).replace(
      '<main id="root"></main>',
      `<main id="root">${app}</main>`
    );
    res.send(html);
    // Cache policy for production
    if (process.env.NODE_ENV === "production") {
      await set({ key: req.url, value: html, expire: 60 * 60 * 24 });
    }
  } catch (err) {
    return res.status(503).send(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening at port ${process.env.PORT}`);
});
