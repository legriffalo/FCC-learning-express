let express = require("express");
require("dotenv").config();

let app = express();

module.exports = app;
console.log("Hello World");
const uppernator = (obj) => {
  return {
    ...obj,
    ...Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === "string" ? value.toUpperCase() : value,
      ])
    ),
  };
};

// respond to get with string
function getHandler(req, res) {
  res.send("Hello Express");
}

// serve a page in response to get
function getPageHandler(req, res) {
  res.sendFile(__dirname + "/views/index.html");
}
const testJson = { message: "Hello json" };
const getJsonHandler = (req, res) => {
  const response =
    process.env.MESSAGE_STYLE == "uppercase" ? uppernator(testJson) : testJson;
  res.json(response);
};

// In Express, you can put in place this functionality
// using the middleware express.static(path), where the path
// parameter is the absolute path of the folder containing
// the assets.
const static = express.static(__dirname + "/public");

//mware function gets the variables of the request method, path and ip address
const mware = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
};

// middle ware has to be added using a method of the app
app.use("/public", static);
app.use(mware);
app.get(
  "/now",
  function (req, res, next) {
    req.time = { time: new Date().toString() };
    console.log(req.time);
    next();
  },
  function (req, res) {
    res.send(req.time);
  }
);

app.get("/:word/echo", (req, res) => {
  const word = req.params.word;
  res.json({ echo: word });
});

// set the route and handler for root url
app.get("/", getPageHandler);
// create a route to request a json object
app.get("/json", getJsonHandler);
