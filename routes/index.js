module.exports = function (app) {
  app.get("/", function (req, res, next) {
    res.render("index", { title: "Express", lang: req.cookies.lang ? req.cookies.lang.split('-')[0] : "ko" , windowid: app.serversettings.windowid, api: app.configs.googlemapsapikey});
  });

  app.get("/lang/:id", function (req, res, next) {
    res.send(app.langdata[req.params.id]);
  });

  app.get("/logout", function (req, res, next) {
    delete req.session.user;
    res.redirect('/');
  });

  app.get("/admin", function (req, res, next) {
    res.render("admin", { title: "Express", lang: req.cookies.lang ? req.cookies.lang.split('-')[0] : "ko" , windowid: app.serversettings.windowid});
  });
};
