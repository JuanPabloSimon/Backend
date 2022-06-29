function getRoot(req, res) {
  res.sendFile(__dirname + "/public/index.html");
}

function getLogin(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("profile");
  } else {
    res.render("login");
  }
}

function getSignup(req, res) {
  res.render("signup");
}

function postLogin(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("logged");
  } else {
    res.redirect("login");
  }
}

function postSignup(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("logged");
  } else {
    res.redirect("login");
  }
}

function getFaillogin(req, res) {
  console.log("error en login");
  res.render("loginfail");
}

function getFailsignup(req, res) {
  console.log("error en signup");
  res.render("signupfail", {});
}

function getLogout(req, res) {
  req.logout((err) => {
    if (!err) {
      res.render("logout");
    }
  });
}

function failRoute(req, res) {
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
