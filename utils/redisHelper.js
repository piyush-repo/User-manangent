"use strict";


let redis = require('redis'),
    path = require('path'),
    config = require(path.resolve('.') + '/config/config'),
    redisClient = redis.createClient(config.port, config.host);


let Redis = function () {

    // function to save the token with expire time
    this.setex = (key, value, timetoLive) => {
        return new Promise((resolve, reject) => {
            redisClient.setex(key, timetoLive, JSON.stringify(value), (err, success) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(success);
                }
            })
        })

    }

    // function to set the token without expire time
    this.set = (key, value) => {
        return new Promise((resolve, reject) => {
            redisClient.set(key, JSON.stringify(value), (err, success) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(success)
                }
            })
        })
    }
    // function to get the token details
    this.get = (key) => {
        return new Promise((resolve, reject) => {
            redisClient.get(key, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data)
                }
            })
        })
    }
    // function to delete the token details
    this.del = (key) => {
        return new Promise((resolve, reject) => {
            redisClient.exists(key, (err, result) => {
                if (result === 1) {
                    redisClient.del(key, (err, deleted) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(deleted);
                        }
                        return;
                    })
                }
                if (result === 0) {
                    reject(new Error("Invalid Token"));
                    return;
                }
                if (err) {
                    reject(err);
                    return;
                }
            })
        })
    }
    // function to check the existence of the valid token 
    this.exists = (key) => {
        return new Promise((resolve, reject) => {
            if (key === undefined) {
                reject(new Error("key undefined"));
            }
            redisClient.exists(key, function (error, result) {
                if (result === 1) {
                    resolve(true);
                }
                if (result === 0) {
                    resolve(false);
                }
                if (error) {
                    reject(error);
                }
            });
        });
    };

    this.incr = (key) => {
        return new Promise((resolve, reject) => {
            if (key === undefined) {
                reject(new Error("key undefined"));
            }
            redisClient.incr(key, function (error, result) {
                if (result) {
                    resolve(true);
                }
                if (error) {
                    reject(error);
                }
            });
        });
    };
}


module.exports = new Redis();