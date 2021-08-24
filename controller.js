"use strict";
exports.__esModule = true;
exports.mainExercisTracker = exports.DefaultExerciseTracker = void 0;
var nodeCache = require("node-cache");
var cache = new nodeCache({ stdTTL: 60 });
var DefaultExerciseTracker = /** @class */ (function () {
    function DefaultExerciseTracker() {
    }
    DefaultExerciseTracker.prototype.addUser = function (req, res) {
        var newUserID = 'u' + Date.now().toString();
        var userObj = { username: req.body.username, logs: null };
        cache.set(newUserID, userObj);
        var resp = { _id: newUserID, username: userObj.username };
        res.status(200).send(resp);
    };
    DefaultExerciseTracker.prototype.findUsers = function (req, res) {
        var userIDs = cache.keys();
        var users = [];
        userIDs.forEach(function (userID) {
            var userObj = cache.get(userID);
            users.push({ _id: userID, username: userObj.username });
        });
        res.status(200).send(users);
    };
    DefaultExerciseTracker.prototype.addExercise = function (req, res) {
        if (cache.has(req.params.userID)) {
            var userLogs = cache.get(req.params.userID);
            var userObj = userLogs;
            var reqDateStr = req.body.date;
            var dateStr = function (reqDateStr) {
                if (reqDateStr === "") {
                    var today = new Date();
                    var year = today.getFullYear().toString();
                    var month = (today.getMonth() + 1).toString();
                    var date = today.getDate().toString();
                    return year + "-" + month + "-" + date;
                }
                return reqDateStr;
            }(reqDateStr);
            var logObj = {
                date: dateStr,
                desc: req.body.description,
                duration: req.body.duration
            };
            if (userObj.logs != null) {
                userObj.logs.push(logObj);
            }
            else {
                userObj.logs = [logObj];
            }
            cache.set(req.params.userID, userObj);
            var dateObj = new Date();
            if (reqDateStr !== "") {
                var splitted = reqDateStr.split("-", 3);
                dateObj.setFullYear(+splitted[0], +splitted[1] + 1, +splitted[2]);
            }
            var resp = {
                _id: req.params.userID,
                username: userObj.username,
                date: dateObj.toDateString(),
                duration: logObj.duration,
                description: logObj.desc
            };
            res.status(200).send(resp);
            return;
        }
        res.status(200).send({ error: 'not found' });
    };
    DefaultExerciseTracker.prototype.findExercises = function (req, res) {
        if (cache.has(req.params.userID)) {
            // TODO: date filter with from/to param
            // TODO: limit param
            var userLogs = cache.get(req.params.userID);
            var userObj = userLogs;
            res.status(200).send({ msg: 'found', log: userObj.logs });
            // TODO: format
            // TODO: add count(len of log)
            return;
        }
        res.status(200).send({ error: 'Not Found' });
    };
    return DefaultExerciseTracker;
}());
exports.DefaultExerciseTracker = DefaultExerciseTracker;
exports.mainExercisTracker = DefaultExerciseTracker;
