import express from "express";
import { engine } from "express-handlebars";
import helpers from "./views/helpers/helpers.js";

import validateEnv from "./utils/validateEnv.js";
import logger from "./middlewares/logger.js";
import morgan from "morgan";
import router from "./router/router.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { v4 as uuidv4 } from "uuid";

declare module "express-session" {
  interface SessionData {
    uid: string;
  }
}

const env = validateEnv();
const PORT = env.PORT;
const app = express();

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

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    name: "sid",
    genid: () => uuidv4(),
    secret: process.env.SECRET || "secret_padrao_seguro",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  res.locals.logado = !!req.session?.uid;
  next();
});

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
