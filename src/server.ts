const express = require("express");
const { counterValidator } = require("./middlewares/count");
const { counterController } = require("./controllers/count");

export const createServer = (port = 3000) => {
  const app = express();

  app.get("/tasks/:status/count", counterValidator);
  app.get("/tasks/:status/count", counterController);

  const server = app.listen(port, () =>
    console.log(`[server] listening on port ${port}`),
  );

  return {
    app,
    close: () =>
      new Promise((resolve) => {
        server.close(() => {
          resolve(true);
          console.log("[server] closed");
        });
      }),
  };
};

createServer();
