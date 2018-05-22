let mongoose = require("mongoose"),
    config = require("../config/config");

mongoose.set("debug", true);

// Connecting to the mongodb database
mongoose.connect(config.mongodb.uri, config.mongodb.options);

// Listening to the events emitted by Mongoose middleware 
mongoose.connection.on("connected", function () {
    console.log("Mongoose Default connection open");
});

mongoose.connection.on("error", function (err) {
    console.log("Mongoose Default connection error : " + err)
});

mongoose.connection.on("disconnected", function () {
    console.log("Mongoose Default connection disconnected...... ");
});

process.on("SIGINT", function () {
    mongoose.connection.close(function () {
        console.log("Mongoose Default connection disconnected through application termination");
        process.exit(0);
    });
});

module.exports = mongoose;