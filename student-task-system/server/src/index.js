import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();
app.listen(config.port, () => {
  console.log(`Task API listening on port ${config.port}${config.usingEmulators ? " (using Firebase emulators)" : ""}`);
  console.log(`Allowed frontend origins: ${config.allowedOrigins.join(", ")}`);
});
