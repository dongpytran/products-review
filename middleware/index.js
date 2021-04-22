const Comment    = require("../models/comment"),
      User       = require("../models/user"),
      Product = require("../models/product");

const middleware = {

    // Logged in check
    isLoggedIn: function(request, response, next) {

        if (request.isAuthenticated()) {
            return next();
        }
        request.flash("error", "You have to be logged in to do that");
        response.redirect("/login");
    },

    // Comment ownership check
    isAuthorisedCmt: function(request, response, next) {

        if (request.isAuthenticated()) {
            Comment.findById(request.params.cmtId, (err, foundCmt) => {

                if (err || !foundCmt) response.send("Comment Not Found");
                else {
                    if (foundCmt.author.equals(request.user._id)) next();
                    else {
                        request.flash("error", "You do not have required permissions");
                        response.redirect("back");
                    }
                }
            });
        }
    },

    // Product ownership check
    isAuthorisedProduct: function(request, response, next) {

        if (request.isAuthenticated()) {
            Product.findById(request.params.id, (err, foundProduct) => {
    
                if (err || !foundProduct) response.redirect("back");
                else if (foundProduct.owner === request.user.username) next();
                else {
                    request.flash("error", "You do not have required permissions");
                    response.redirect(`/products/${request.params.id}`);
                }
            });
        } else {
            request.flash("error", "You have to be logged in to do that");
            response.redirect(`/products/${request.params.id}`);
        }
    },

    // user authorisation for account
    isAuthorisedUser: function(request, response, next) {

        if (request.user === undefined) {
            request.flash("error", "You have to be logged in first");
            response.redirect("/products");
            return;
        }

        User.findOne({username: request.params.user}, (err, foundUser) => {
            if (err || !foundUser) {
                request.flash("error", "No User found");
                response.redirect("/products");
            } else {

                if (request.user._id.equals(foundUser._id)) {
                    return next();
                }
                request.flash("error", `You are not ${foundUser.name}`);
                response.redirect("/products");
            }
        });
    }
}

module.exports = middleware;