import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";
import helpers from "./views/helpers/helpers.js";

import validateEnv from "./utils/validateEnv.js";
import logger from "./middlewares/logger.js";
import morgan from "morgan";
import router from "./router/router.js";

const env = validateEnv();
const PORT = env.PORT;
const app = express();

declare module "express-session" {
  interface SessionData {
    uid: string;
  }
}

app.engine(
  "handlebars",
  engine({
    helpers,
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  res.locals.uid = req.session.uid;
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
