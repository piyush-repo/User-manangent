"use strict";

let mongoose = require("./connection.js");

module.exports = {
    users: require("./schema/user.js")(mongoose)
}