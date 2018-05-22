"use strict";
//let Empl
let logger = require("./logger"),
  path = require("path"),
  jwt = require("jwt-simple"),
  userModel = require(path.resolve(".") + "/mongodb/").users,
  err_msg = require(path.resolve(".") + "/config/components/customErrMsg.js"),
  redis = require(path.resolve(".") + "/utils/redisHelper.js"),
  config = require(path.resolve(".") + "/config/config");


// Funcation to generate the access token
exports.generateJWTToken = user => {
  return new Promise((resolve, reject) => {
    try {
      // To generate token
      let secretKey =
        "a782c40996bd5249b7158949618c1fdad7e5ea7411f1e450ffa5cc4731273329";
      let expires = expiresIn(1); // 1 day
      let token = jwt.encode(
        {
          exp: expires,
          user:user
        },
        config.secretKey
      );

      let genToken = {
        token: token,
        tokenType: "JWT",
        expires: expires,
        user: user
      };
      logger.info(
        "[utils] [utils] [generateJWTToken] token generate success",
        genToken
      );
      resolve(genToken);
    } catch (err) {
      logger.error("[utils] [utils] [generateJWTToken] error: ", err);
      reject({ status: "500", reason: err });
    }
  });
};

// Function to remove the token from key value store
exports.expireToken = authHeader => {
  return new Promise((resolve, reject) => {
    let token;
    if (authHeader) {
      authHeader = authHeader.split(" ");
      token = authHeader[1];
      if (!authHeader[0] || authHeader[0] === undefined) {
        reject(new Error("Unknown token type"));
      }
      if (!token || token === undefined) {
        reject(new Error("Missing token in header"));
      }
      return redis
        .del(token)
        .then(success => {
          resolve(success);
        })
        .catch(error => {
          reject(error);
        });
    } else {
      reject(new Error("Missing authorization in header"));
    }
  });
};

exports.verifyToken = authHeader => {
  return new Promise((resolve, reject) => {
    let token;
    if (authHeader) {
      authHeader = authHeader.split(" ");
      token = authHeader[1];
      console.log("Token : ", token);
      if (!authHeader[0] || authHeader[0] === undefined) {
        reject(new Error("Unknown token type"));
      }
      if (!token || token === undefined) {
        reject(new Error("Missing token in header"));
      }
      return redis
        .get(token)
        .then(data => {
          if (data) {
            decryptTokenAndVerify(token)
              .then(verified => {
                resolve(data);
              })
              .catch(err => {
                reject(err);
              });
          }
        })
        .catch(error => {
          reject(error);
        });
    } else {
      reject(new Error("Missing authorization in header"));
    }
  });
};

function decryptTokenAndVerify(token) {
  return new Promise((resolve, reject) => {
    let data = jwt.decode(token, config.secretKey);
    console.log("data : ",data);
    userModel
      .findOne({ deleted: false, emailId: data.user.emailId })
      .then(user => {
        if (user) {
          if (user.emailId===data.user.emailId) {
            resolve(true);
          }
        }
      })
      .catch(err => {
        reject(new Error("Authorization validation error"));
      });
  });
}

function expiresIn(numDays) {
  let dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

exports.checkNoofAttempts = function (emailId){
    
    return redis.get(emailId);
}

module.exports = exports;
