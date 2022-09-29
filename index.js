require("./config/mongo")
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const path = require('path');
const { log } = require("console")
const express = require("express");
const session = require("express-session")
const auth = require("./helpers/auth")
const hbs = require("express-handlebars");

const app = express()
app.use(helmet())
app.use(cookieParser())
app.use(express.cookieParser())
app.use

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


app.engine("hbs", hbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

app.get("/secret", auth, (req, res) => {
  res.render("secret", { user: `${req.session.user.name} ${req.session.user.lastName}`, id: req.session.user.id })
})

app.get("/noauth", (req, res) => {
  res.render("noAuth")
})

app.use("/users", require("./routes/usersRt"))



app.listen(3000, err => {
  !err ? log('server running on http://localhost:3000') : log('server running on http://localhost:3000')
})