let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  helmet = require("helmet"),
  cors = require("cors"),
  router = require("./routes"),
  path = require("path"),
  env = require("./config/components/environment.js"),
  logger = require(path.resolve(".") + "/utils/logger"),
  auth = require(path.resolve(".") + "/routes/middleware/Auth.js");

// Secure express app by setting HTTP headers
app.use(helmet());
// allowing cross origin request
app.use(cors());
// Body-parser (To parse the request body)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

// setting  Port
app.set("Port", process.env.PORT || env.development);

/*
    Add to avoid cross origin access.
    Access-Control-Allow-Origin is set to '*' so that server REST APIs are accessible for all the domains.
    By setting domain name to some value, the API access can be restricted to only the mentioned domain.
    Eg, Access-Control-Allow-Origin: 'mywebsite.com'
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Content-Type");
  //   res.header("Access-Control-Expose-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Content-Type", "application/json");
  res.header("X-Frame-Options", "DENY");
  next();
});

// Authentication middleware
app.use("/", auth.token);


// router middleware
app.use("/", router);

// Error handling and non existence of endpoint or method handler middleware
app.use("/",function(req, res) {
  
    res
      .status(404)
      .json({ success: false, error: { message: "URL not found" } });
  
});

app.listen(app.get("Port"), function() {
  logger.info("Application started on port " + app.get("Port"));
});
