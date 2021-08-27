const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });
require("./config/passport")(passport);

const app = express();

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Handlebars
app.engine(
    ".hbs",
    exphbs({
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
    })
);

// initialize passsport
app.use(passport.initialize());
app.use(passport.session());

// connect with mongodb database
connectDB();

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server listening at ${process.env.NODE_ENV} on port ${PORT}`)
);
