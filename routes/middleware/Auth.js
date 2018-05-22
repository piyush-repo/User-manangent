"use strict";
let path = require("path"),
  logger = require(path.resolve(".") + "/utils/logger"),
  utils = require(path.resolve(".") + "/utils/utils"),
  url = require("url");

let Auth = function() {
  /**
   *  Checks if all the parameters required are provided
   */

  this.token = (req, res, next) => {
    let unauthorizedCode = "UNAUTHORIZED";
    let skipUrl = ["/login", "/logout","/createProfile"];
    let urlPath = url.parse(req.url).pathname;
    req.headers.urlPath = urlPath;

    if (
      skipUrl.indexOf(urlPath) > -1 ||
      req.method.trim().toLowerCase() === "options"
    ) {
      logger.info(
        `[middleware] [auth] [token] skipping url ${req.method} ${urlPath}`
      );
      next();
      return;
    }
    if (req.headers && req.headers["access-token"]) {
      logger.info(
        `[middleware] [auth] [token] authenticated API ${req.method} ${urlPath}`
      );
      utils
        .verifyToken(req.headers["access-token"])
        .then(result => {
          if (result) {
            req.userObj = JSON.parse(result);
            next();
          } else {
            logger.error(
              `[middleware] [auth] [token] [verifyToken] Token not exist ${urlPath} ::  `
            );
            return res.status(401).send({
              success: false,
              error: {
                code: unauthorizedCode,
                message: "Token not exist"
              }
            });
          }
        })
        .catch(error => {
          logger.error(
            `[middleware] [auth] [token] [verifyToken] Error in Token verfication  ${urlPath} ::  `,
            error
          );
          return res.status(401).send({
            success: false,
            error: {
              code: unauthorizedCode,
              message: "Authorization validation error"
            }
          });
        });
    } else {
      logger.error(
        `[middleware] [auth] [token] [verifyToken] Invalid authorization header ${urlPath}`
      );
      return res.status(401).send({
        success: false,
        error: {
          code: unauthorizedCode,
          message: "Invalid authorization header"
        }
      });
    }
  };
};

module.exports = new Auth();
