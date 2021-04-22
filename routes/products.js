function addProduct(ProducPost, user) {
    ProducPost.owner = user.username;

    Product.create(ProducPost).then((product) => {
        User.findById(user._id, (err, foundUser) => {
            foundUser.productsAdded.push(product._id);
            foundUser.save();
        });
    });
}

function formatAddress(address) {
    var ar = address.split(",");

    for (var i = 0; i < ar.length; i++) {
        ar[i] = ar[i].trim().replace(" ", "+");
    }
    address = ar.join();

    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDyV8grOSb_vfPrEynVo44jW-yqGkqOKz0&q=${address}`;
}



// Main Function
const express    = require("express"),
      router     = express.Router(),
      User       = require("../models/user"),
      Product = require("../models/product"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");


// =======
// Routes
// =======


// Landing/HomePage route
router.get("/", (request, response) => {
    response.render("generic/landing");
});

// products list route
router.get("/products", (request, response) => {
    Product.find({}, (err, allPros) => {
        if (err || !allPros) response.redirect("/");
        else response.render("product/products", {grounds: allPros, currentUser: request.user});
    });
});

// product add form route
router.get("/products/new", middleware.isLoggedIn, (request, response) => {
    response.render("product/productNew", {currentUser: request.user});
});

// product add post route
router.post("/products", middleware.isLoggedIn, (request, response) => {
    addProduct(request.body.product, request.user);
    response.redirect("/products");
});



// Product show route
router.get("/products/:id", (request, response) => {
    Product.findById(request.params.id).populate("comments").exec((err, camp) => {
        if (err || !camp) {
            request.flash("error", "Requested Product Not Found");
            response.redirect("/products");
        } else {
            let src = formatAddress(camp.location);
            response.render("product/productShow", {ground: camp, currentUser: request.user, link: src});
        }
    });
});

// Product edit-get route
router.get("/products/:id/edit", middleware.isAuthorisedProduct, (request, response) => {
    Product.findById(request.params.id, (err, foundProduct) => {
        response.render("product/ProductEdit", {ground: foundProduct});
    });
});

// Product edit-put route
router.put("/products/:id", middleware.isAuthorisedProduct, (request, response) => {
    Product.findByIdAndUpdate(request.params.id, request.body.ground, (err, foundProduct) => {
        if (err) response.redirect("/products");
        else {
            request.flash("success", "Product Editted");
            response.redirect(`/products/${request.params.id}`);
        }
    });
});

// Product delete route
router.delete("/products/:id", middleware.isAuthorisedProduct, (request, response) => {
    Product.findById(request.params.id, (err, foundPro) => {
        for (var comment of foundPro.comments) {
            Comment.findByIdAndDelete(comment);
        }

        User.findOne({username: request.user.username}, (err, foundUser) => {
            if (err) response,redirect("/products");
            else {
                let index = foundUser.productsAdded.indexOf(foundPro._id);
                if (index > -1) {
                    foundUser.productsAdded.splice(index);
                    foundUser.save();
                }
            }
        });
    });

    Product.findByIdAndDelete(request.params.id, (err) => {
        response.redirect("/products");
    });
});

// ==========
// End Routes
// ==========

module.exports = router;