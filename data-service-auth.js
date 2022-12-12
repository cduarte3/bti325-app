// require mongoose and setup the Schema ------------------------------------------------------------------------
// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// define the user schema
var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{ "dateTime": Date, "userAgent": String }]
});

let User; // to be defined on new connection (see below)

module.exports.initialize = function () {
    console.log("this is initialize");
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(`mongodb+srv://christian-duarte7:Cd1136456@senecaweb.pbcgl7p.mongodb.net/A6`);

        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            console.log("hello");
            User = db.model("users", userSchema);
            resolve();
        });
    });
}

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password === "" || userData.password2 === "") {
            reject("Error: user name cannot be empty or only white spaces! ");
        }
        else if (userData.password != userData.password2) {
            reject("Error: Passwords do not match");
        }
        else {
            let newUser = new User(userData);
            newUser.save((error) => {
                if (error) {
                    if (error.codeY == 11000) {
                        reject("User name already taken");
                    }
                    else {
                        reject("There was an error creating the user: " + error);
                    }
                }
                else {
                    resolve();
                }
            })
        }
    });
}


module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.findOne({ userName: userData.userName })
            .exec().then((foundUser) => {
                //console.log(foundUser);
                if (!foundUser) {
                    reject("Unable to find user: " + userData.userName);
                }
                else if (foundUser.password != userData.password) {
                    reject("Incorrect Password for user: " + userData.userName);
                }
                foundUser.loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                foundUser.update(
                    //console.log(foundUser),
                    { userName: foundUser.userName },
                    { $set: { loginHistory: foundUser.loginHistory } }
                ).exec().then(() => {
                    //console.log(foundUser);
                    resolve(foundUser);
                })
                    .catch((err) => {
                        reject("There was an error verifying the user: " + err);
                    });
            })
            .catch(() => {
                reject("Unable to find user: " + userData.userName);
            });
    });
}