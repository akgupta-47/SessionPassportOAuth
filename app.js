const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });
require("./config/passport")(passport);

const app = express();

// accept form data
app.use(express.urlencoded({ extended: false }));
// accept json data
app.use(express.json());

// Logging
if (process.env.NODE_ENV === "{working-mode}") {
    app.use(morgan("dev"));
}

const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
} = require("./helpers/hbs");

// Handlebars
app.engine(
    ".hbs",
    exphbs({
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select,
        },
        defaultLayout: "main",
        extname: ".hbs",
    })
);
app.set("view engine", ".hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
);

// initialize passsport
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// connect with mongodb database
connectDB();

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server listening at ${process.env.NODE_ENV} on port ${PORT}`)
);
