import { env } from "./config/env.js";
import { createServer } from "./server.js";

const server = createServer();

server.listen(env.API_PORT, () => {
  console.log(`RMS API listening on http://localhost:${env.API_PORT}`);
});
