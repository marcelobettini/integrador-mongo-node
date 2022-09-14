const securePass = require("../helpers/securePass")
const User = require("../schemas/usersSchema")

function getLoginForm(req, res, next) {
  res.render("loginForm")
};
async function sendLoginForm(req, res, next) {
  const { email, pass } = req.body;
  const user = await User.find().where({ email })
  if (!user.length) {
    return res.render("loginForm", { message: "Usuario o contraseña incorrectos" })
  };

  if (await securePass.decrypt(pass, user[0].password)) {
    req.session.user = `${user[0].name} ${user[0].lastName}`
    res.render("secret", { user: req.session.user })
  } else return res.render("loginForm", { message: "Usuario o contraseña incorrectos" })
};

function getRegisterForm(req, res, next) {
  res.render("registerForm")
};

//Crear nuevo usuario
async function sendRegisterForm(req, res, next) {
  const { name, lastName, email, pass } = req.body
  const password = await securePass.encrypt(pass)

  const newUser = new User({
    name, lastName, email, password
  })
  newUser.save((err) => {
    if (!err) {
      req.session.user = `${name} ${lastName}`
      res.render("secret", { user: req.session.user })
    } else {
      res.render("registerForm", { message: "Ya existe un registro  con ese email" })
    }
  })
};

//logout
function logout(req, res) {
  req.session.destroy()
  res.redirect("/");
}

module.exports = { getLoginForm, sendLoginForm, getRegisterForm, sendRegisterForm, logout }

