const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String,
    time: {
        type: Date,
        default: Date.now
    },
    content: String,
    rating: Number
});

module.exports = mongoose.model("Comment", commentSchema);