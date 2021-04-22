const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    cost: Number,
    bookingStart: String,
    bookingClose: String,
    contact: String,
    location: String,
    amenities: String,
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ],
    rating: {
        type: Number,
        default: 0
    },
    owner: String
});

module.exports = mongoose.model("Product", productSchema);