const log4js = require("log4js");

log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerWarn: { type: "file", filename: "warn.log" },
    miLoggerError: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "info" },
    fileError: { appenders: ["miLoggerError"], level: "error" },
    fileWarn: { appenders: ["miLoggerWarn"], level: "warn" },
  },
});

function getRoot(req, res) {
  res.sendFile(__dirname + "/public/index.html");
}

function getLogin(req, res) {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:8080/login' - Método: 'GET'`);
  if (req.isAuthenticated()) {
    res.redirect("profile");
  } else {
    res.render("login");
  }
}

function getSignup(req, res) {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:8080/signup' - Método: 'GET'`);
  res.render("signup");
}

function postLogin(req, res) {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:8080/login' - Método: 'POST'`);
  if (req.isAuthenticated()) {
    res.redirect("logged");
  } else {
    res.redirect("login");
  }
}

function postSignup(req, res) {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:8080/signup' - Método: 'POST'`);
  if (req.isAuthenticated()) {
    res.redirect("logged");
  } else {
    res.redirect("login");
  }
}

function getFaillogin(req, res) {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:8080/loginfail' - Método: 'GET'`);
  console.log("error en login");
  res.render("loginfail");
}

function getFailsignup(req, res) {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(
    `Ruta: 'http://localhost:8080/signupfail' - Método: 'GET'`
  );
  console.log("error en signup");
  res.render("signupfail", {});
}

function getLogout(req, res) {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:8080/logout' - Método: 'GET'`);
  let usuario = req.user.firstName;
  req.logout((err) => {
    if (!err) {
      res.render("logout", { usuario: usuario });
    }
  });
}

function failRoute(req, res) {
  const loggerDefault = log4js.getLogger("fileWarn");
  loggerDefault.warn(
    `Ruta inexistente: 'http://localhost:8080/' - Método: 'GET'`
  );
  res.status(404).render("routingerror", {});
}

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  getRoot,
  getLogin,
  postLogin,
  getFaillogin,
  getLogout,
  failRoute,
  getSignup,
  postSignup,
  getFailsignup,
  checkAuthentication,
};
