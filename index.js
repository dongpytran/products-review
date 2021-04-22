// MAIN FUNCTION 
// Dependencies
const express        = require("express"),
      parser         = require("body-parser"),
      mongoose       = require("mongoose"),
      local          = require("passport-local"),
      passport       = require("passport"),
      methodOverride = require("method-override"),
      User           = require("./models/user"),
      flash          = require("connect-flash");

const app = express();

const ProductRoutes = require("./routes/products"),
      authRoutes       = require("./routes/auth"),
      commentRoutes    = require("./routes/comments");


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(parser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/qltt_review_sp", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
});


// =====================
// Passport Config
// =====================

app.use(require("express-session")({
    secret: "Dang Ket Noi Bro",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(request, response, next){
    response.locals.currentUser = request.user;
    response.locals.error = request.flash("error");
    response.locals.success = request.flash("success");
    next();
});


// Routes
app.use(ProductRoutes);
app.use(authRoutes);
app.use(commentRoutes);


// Server listen
app.listen(3000, function() {
    console.log("Server Started");
});