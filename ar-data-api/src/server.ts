import App from "./app";
import AssociationController from "./routes/associations";

console.log(
  `\n\n server.ts: 🌽 🌽 🌽   Constructing new App object .... 🌽 🌽 🌽 `
);
const app = new App([new AssociationController()], 5000);

app.listen();
