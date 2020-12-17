import express from "express";
import bodyParser from "body-parser";
import path from "path";
import routes from "./routes";

const { NODE_ENV } = process.env;

const buildDir = path.join(process.cwd() + "/build");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

if (NODE_ENV === "production") {
  app.use(express.static(buildDir));
}

app.use(function (req, res, next) {
  const acceptedOrigins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "https://familie-brev.intern.nav.no",
  ];
  const defaultAcceptedOrigin = "https://familie-brev.intern.nav.no";
  const origin = req.header("origin")?.toLowerCase();

  res.setHeader(
    "Access-Control-Allow-Origin",
    origin && acceptedOrigins.includes(origin) ? origin : defaultAcceptedOrigin
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

app.use("/api", routes);

const port = 8000;
console.log("checking port", port);
app.listen(port, () => {
  console.log(`Server now listening on port: ${port}`);
});