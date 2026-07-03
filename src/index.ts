import express from "express";
import { engine } from "express-handlebars";
import helpers from "./views/helpers/helpers.js";

import validateEnv from "./utils/validateEnv.js";
import logger from "./middlewares/logger.js";
import morgan from "morgan";
import router from "./router/router.js";

const env = validateEnv();
const PORT = env.PORT;
const app = express();

app.engine(
  "handlebars",
  engine({
    helpers,
    partialsDir: `${process.cwd()}/src/views/partials`,
  }),
);
app.set("view engine", "handlebars");
app.set("views", `${process.cwd()}/src/views`);

app.use(morgan("short"));
app.use(logger("complete"));

app.use("/img", express.static(`${process.cwd()}/public/img`));
app.use("/css", [
  express.static(`${process.cwd()}/public/css`),
  express.static(`${process.cwd()}/node_modules/bootstrap/dist/css`),
]);
app.use("/js", [
  express.static(`${process.cwd()}/public/js`),
  express.static(`${process.cwd()}/node_modules/bootstrap/dist/js`),
]);

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
