// A JavaScript class

class HotReloadPlugin {
  constructor({ port }) {
    const server = require("http").createServer();
    this.io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (client) => {
      console.log("[+] Client connected to HR Plugin");
    });

    this.io.listen(port);
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync("HotReloadPlugin", (_, callback) => {
      this.io.emit("reload", true);
      callback();
    });
  }
}

const injectHRClient = ({ port, cdn }) => {
  return function (_, res, next) {
    if (process.env.NODE_ENV === "development") {
      const originalSend = res.send;
      function injectScriptTag(html) {
        return html.replace(
          "<!-- SOCKET.IO -->",
          `<script src="${cdn.url}" integrity="${cdn.integrity}" crossorigin="anonymous"></script>
              <script>
                const socket = io('http://localhost:${port}');
                socket.on('reload', (data) => {
                  setTimeout(() => {
                    window.location.reload()
                  }, 1500)
                })
              </script>`
        );
      }
      res.send = function () {
        arguments[0] = injectScriptTag(arguments[0]);
        originalSend.apply(res, arguments);
      };
    }
    next();
  };
};

module.exports = {
  HotReloadPlugin,
  injectHRClient,
};
