require("./config/mongo")
const path = require('path');
const { log } = require("console")
const express = require("express");
const session = require("express-session")

const hbs = require("express-handlebars");

const app = express()

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));


app.engine("hbs", hbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get("/", (req, res) => {
  res.render("home");
});

const auth = (req, res, next) => {
  if (req.session.user) {
    next()
  } else res.render("noAuth")
}

app.get("/secret", auth, (req, res) => {
  res.render("secret", { user: req.session.user })
})

app.use("/users", require("./routes/usersRt"))



app.listen(3000, err => {
  !err ? log('server running on http://localhost:3000') : log('server running on http://localhost:3000')
})