"use strict";

let path = require("path"),
  controller = require("./controller"),
  logger = require(path.resolve(".") + "/utils/logger");

let user = function () {
  this.login = (req, res, next) => {
    let data = req.body;

    controller
      .login(data)
      .then(data => {
        if (data) {
          logger.info("router | api | user | login(function) | success ");
          let dataset = {
            empData: data.userData,
            token: "bearer-Token "+data.token
          }
          res.status(200).json({ success: true, payload: dataset });
        }
      })
      .catch(err => {
        logger.error("router | api | user | login(function) | error : ", err);
        res.status(404).json({ success: false ,error:{message:err.message} });
      });
  };

  this.logout = (req, res, next) => {
    let data = req.headers;

    controller
      .logout(data)
      .then(data => {
        if (data) {
          logger.info("router | api | user | logout(function) | success ");
          res.status(200).json({ success: true });
        }
      })
      .catch(err => {
        logger.error("router | api | user | logout(function) | error : ", err);
        res.status(404).json({ success: false });
      });
  };

  this.createProfile = (req, res, next) => {
    let data = req.body;
    controller
      .createProfile(data)
      .then(success => {
        if (success) {
          logger.info(
            "router | api | user | createProfile(function) | success "
          );
          res.status(200).json({ success: true });
        }
      })
      .catch(err => {
        logger.error(
          "router | api | user | createProfile(function) | error : ",
          err
        );
        res.status(404).json({ success: false });
        //next(err);
      });
  };

  this.updateProfile = (req, res, next) => {
    let data = req.body;
    controller
      .updateProfile(data)
      .then(success => {
        if (success) {
          logger.info(
            "router | api | user | updateProfile(function) | success "
          );
          res.status(200).json({ success: true });
        }
      })
      .catch(err => {
        logger.error(
          "router | api | user | updateProfile(function) | error : ",
          err
        );
        res.status(404).json({ success: false });
        //next(err);
      });
  };
 
};

module.exports = new user();
