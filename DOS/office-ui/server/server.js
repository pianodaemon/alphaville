var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
const { listUsers, readUser, createUser } = require("./users");
var cors = require('cors');

const PORT = 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

/*
app.use(cors({
  origin: 'http://localhost:3000'
}));
*/

var allowlist = ['http://localhost:3000',]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { credentials: true, origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
};

var router = express.Router();

app.options('/users', cors(corsOptionsDelegate));

router.get("/", function (req, res) {
  res.send("Dylk!");
});

router.get("/users", cors(corsOptionsDelegate), function (req, res) {
  listUsers()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.put("/users", cors(corsOptionsDelegate), function (req, res) {
  console.log('req.body: ', req.body);
  createUser(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});

router.get("/users/:id", cors(corsOptionsDelegate), function (req, res) {
  readUser(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json(err));
});


app.use(router);

app.listen(PORT, function () {
  console.log(`Node server running on http://localhost:${PORT}`);
});
