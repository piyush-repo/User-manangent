"use strict";

let express = require("express"),
    path = require("path"),
    router = express.Router(),
    api = require("./api");
   

// Login Route Details
router.post("/login", api.user.user.login);

// Logout Route Details
router.post("/logout",api.user.user.logout);

//create Profile 

router.post("/createProfile", api.user.user.createProfile);

router.post("/updateProfile", api.user.user.updateProfile);



module.exports = router;