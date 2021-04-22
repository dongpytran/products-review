const { request, response } = require("express");

function addComment(newComment, productId, user) {

    newComment.author = user._id;
    newComment.username = user.username;

    Comment.create(newComment).then((comment) => {
        Product.findById(productId, (err, foundPro) => {

            if (err || !foundPro) {
                request.flash("error", "Comment not found");
                response.redirect("back");
            }
            else {
                foundPro.comments.push(comment._id);
                foundPro.rating += parseInt(comment.rating);
                
                foundPro.save().catch((err) => {
                    request.flash("error", "Comment not found");
                });
            }
        });
    });
}


// Main Function
const express    = require("express"),
      router     = express.Router(),
      Comment    = require("../models/comment"),
      Product = require("../models/product"),
      middleware = require("../middleware");


// =======
// Routes
// =======


// New Comment post route
router.post("/products/:id/comment/new", middleware.isLoggedIn, (request, response) => {
    addComment(request.body, request.params.id, request.user);
    response.redirect(`/products/${request.params.id}`);
});

// Comment edit route
router.put("/products/:id/comment/:cmtId", middleware.isAuthorisedCmt, (request, response) => {
    Comment.findByIdAndUpdate(request.params.cmtId, request.body, (err) => {
        if (err) {
            request.flash("error", "Comment Not Found");
            response.redirect("back");
        }
        else response.redirect("back");
    });
});

// Comment delete route
router.delete("/products/:id/comment/:cmtId/delete", middleware.isAuthorisedCmt, (request, response) => {
    Product.findById(request.params.id, (err, foundPro) => {

        if (err || !foundPro) response.redirect("back");
        else {
            Comment.findById(request.params.cmtId, (err, foundCmt) => {

                if (err || !foundCmt) response.redirect("back");
                else {
                    foundPro.rating -= foundCmt.rating;

                    let index = foundPro.comments.indexOf(foundCmt._id);
                    if (index > -1) {
                        foundPro.comments.splice(index);
                    }

                    foundPro.save().then(() => {
                        foundCmt.deleteOne();
                        request.flash("success", "Comment Deleted");
                        response.redirect(`/products/${request.params.id}/`)
                    })
                }
            })
        }
    })
});

// ==========
// End Routes
// ==========

module.exports = router;