"use strict";

let path = require('path'),
    employeeModel = require(path.resolve(".") + "/mongodb/").employee,
    moment = require('moment'),
    logger = require(path.resolve(".") + "/utils/logger"),
    _ = require("underscore"),
    uuidv1 = require("uuid/v1"),
    userModel = require(path.resolve('.') + "/mongodb/").users,
    Utils = require(path.resolve('.') + "/utils/utils"),
    redisHelper = require(path.resolve('.') + "/utils/redisHelper");



let user = function () {
    this.login = (data) => {
        return new Promise((resolve, reject) => {
            Utils.checkNoofAttempts(data.emailId).then((result)=>{
                let count = result;
                console.log("count : ",result);
                if(result <= 3 || !result){
                    userModel.findOne({ emailId: data.emailId, active: true }).then((userData) => {
                    console.log(userData);
                    if (userData && data.password === userData.password) {
                    logger.info('router | api | user | login(function) | success');
                        let Token;
                         console.log("userData :",userData);
                         Utils.generateJWTToken(userData)
                         .then((token) => {
                                Token = token.token;
                                return redisHelper.set(token.token, userData)
                            }).then((success) => {
                                resolve({ token: Token, userData: userData });
                            })
                }
                else {
                    logger.warn('router | api | user | login(function) | fail | please enter correct usercode  ......');
                     if(!result){
                        // setting 1 min of expiry time for again trying to login 
                        redisHelper.setex(data.emailId,1,60).then((result)=>{
                            reject({ message:"Exceeded the no of attempts" }); 
                        }).catch((error)=>{
                            logger.warn('router | api | user | login(function) | Error: ', error);
                            reject({ message: err.message ? err.message : "Server Error" });
                        })
                    }
                    else{
                        redisHelper.incr(data.emailId).then((result)=>{
                            logger.info("No of login attempt by user "+data.emailId+": " , count);
                        }).catch((error)=>{
                            logger.warn('router | api | user | login(function) | Error: ', error);
                            reject({ message: err.message ? err.message : "Server Error" });
                        })
                    }
                    reject({ message: "please enter correct usercode or password ......" });
                }
            }).catch((err) => {
                logger.warn('router | api | user | login(function) | Error: ', err);
                reject({ message: err.message ? err.message : "Server Error" });
            })
            }
            else{
                reject({ message:"Exceeded the no of attempts, maximum allowed is 3 times,please try after 15 seconds" }); 
            }
            }).catch((err) => {
                logger.warn('router | api | user | login(function) | Error: ', err);
                reject({ message: err.message ? err.message : "Server Error" });
            })
        })
    }

    this.logout = (data) => {
        let authToken = data['access-token'];
        return new Promise((resolve,reject)=>{
            Utils.expireToken(authToken).then((success)=>{
                if(success){
                    logger.info("route | api | user | logout(function) | success")
                    resolve(true);
                }
            }).catch((err)=>{
                logger.info("route | api | user | logout(function) | err : ",err);
                reject({ message: err.message ? err.message : "Server Error" });
            })
        })
    }

    this.createProfile = (data) => {
        let profileData = {
            emailId: data.emailId,
            password: data.password
        };
        let userData = new userModel(profileData);
        return userData.save();
    }

    this.updateProfile = (data)=>{
        let setData = {};

        if(data.emailId){
            setData.emailId = data.updateItems.emailId;
        }

        let updateData = {$set:setData};
        return userModel.update({emailId:data.emailId},updateData);
    }
}

module.exports = new user()