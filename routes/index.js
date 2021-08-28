const express = require("express");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story");
const router = express.Router();

router.get("/", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
    // console.log(req.user.firstname);
    try {
        // lean returns a normal js object instead of mongoose document wo\hich has methods like save
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render("dashboard", {
            name: req.user.firstName,
            stories,
        });
    } catch (err) {
        console.log(err);
        res.render("/error/500");
    }
});

module.exports = router;
