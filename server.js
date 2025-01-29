/* eslint-disable  @typescript-eslint/no-require-imports */
// require('dotenv').config()
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const HOST = "dev.flowssync.com";
const hostname = HOST;
const port = 443;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(`./${HOST}-key.pem`),
  cert: fs.readFileSync(`./${HOST}.pem`),
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${hostname}`);
  });
});
