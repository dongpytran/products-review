const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      User       = require("../models/user"),
      middleware = require("../middleware");

// =======
// Routes
// =======


// SignIn-SignUp form routes
router.get("/login", (request, response) => {
    response.render("user/authForms", {currentuser: request.user});
});

// SignUp post route
router.post("/signup", (request, response) => {
    User.register(new User(
    {
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        username: request.body.username 

    }),request.body.password, (err, createdUser) => {

        if (err) {
            request.flash("error", err.message);
            return response.redirect("back");
        }
        passport.authenticate("local")(request, response, () => {
            response.redirect("/products");
        });
    });
});

// Login post route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/products", failureRedirect: "/login"
    }),
    (request, response) => {});

// Logout route
router.get("/logout", (request, response) => {
    request.logout();
    response.redirect("/products");
});

// User show route
router.get("/users/:user", (request, response) => {
    User.findOne({username: request.params.user}).populate("productsAdded").exec((err, foundUser) => {
        if (err || !foundUser) {
            request.flash("error", "No user found");
            return response.redirect("/products");
        }
        const {productsAdded} = foundUser;
        response.render("user/userShow", {user: foundUser, currentUser: request.user, products: productsAdded});
    });
});

// User edit get route
router.get("/users/:user/edit", middleware.isAuthorisedUser, (request, response) => {
    User.findOne({username: request.params.user}, (err, foundUser) => {
        if (err) response.redirect("back");
        else {
            response.render("user/userEdit", {foundUser: foundUser});
        }
    });
});

// User edit post route
router.put("/users/:user", middleware.isAuthorisedUser, (request, response) => {
    User.findOneAndUpdate({username: request.params.user}, request.body.user, (err, foundUser) => {
        if (err) response.redirect("back");
        else {
            request.flash("success", "Updated Info");
            response.redirect(`/users/${foundUser.username}`);
        }
    });
});


// ==========
// End Routes
// ==========

module.exports = router;