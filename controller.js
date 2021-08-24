"use strict";
exports.__esModule = true;
exports.mainExercisTracker = exports.DefaultExerciseTracker = void 0;
var nodeCache = require("node-cache");
var controller_1 = require("./controller");
var cache = new nodeCache({ stdTTL: 60 });
var DefaultExerciseTracker = /** @class */ (function () {
    function DefaultExerciseTracker() {
    }
    DefaultExerciseTracker.prototype.getDate = function (reqDateStr) {
        var dateObj = new Date();
        if (reqDateStr) {
            var splitted = reqDateStr.split("-", 3);
            dateObj.setFullYear(+splitted[0], +splitted[1] - 1, +splitted[2]);
        }
        return dateObj;
    };
    DefaultExerciseTracker.prototype.addUser = function (req, res) {
        console.log("[addu]");
        console.log(req.body);
        var newUserID = 'u' + Date.now().toString();
        var userObj = { username: req.body.username, logs: [] };
        cache.set(newUserID, userObj);
        var resp = { _id: newUserID, username: userObj.username };
        res.status(200).send(resp);
    };
    DefaultExerciseTracker.prototype.findUsers = function (req, res) {
        console.log("[findu]");
        console.log(req.params);
        var userIDs = cache.keys();
        var users = [];
        userIDs.forEach(function (userID) {
            var userObj = cache.get(userID);
            users.push({ _id: userID, username: userObj.username });
        });
        res.status(200).send(users);
    };
    DefaultExerciseTracker.prototype.addExercise = function (req, res) {
        console.log("[addex]");
        console.log(req.params);
        console.log(req.body);
        if (cache.has(req.params.userID)) {
            var userObj = cache.get(req.params.userID);
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
            userObj.logs.push(logObj);
            cache.set(req.params.userID, userObj);
            var dateObj = controller_1.mainExercisTracker.prototype.getDate(reqDateStr);
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
        console.log("[findex]");
        console.log(req.params);
        console.log(req.query);
        if (cache.has(req.params.userID)) {
            var dateFrom = controller_1.mainExercisTracker.prototype.getDate(req.query.from || "2010-01-01");
            var dateTo = controller_1.mainExercisTracker.prototype.getDate(req.query.to || "2888-12-31");
            var limit = req.query.limit || 100000;
            var count = 0;
            var userLogs = cache.get(req.params.userID);
            var logs = [];
            for (var _i = 0, _a = userLogs.logs; _i < _a.length; _i++) {
                var log = _a[_i];
                if (count >= limit) {
                    break;
                }
                var dateObj = controller_1.mainExercisTracker.prototype.getDate(log.date);
                if (dateObj < dateFrom || dateObj > dateTo) {
                    continue;
                }
                count = count + 1;
                logs.push({
                    description: log.desc,
                    duration: log.duration,
                    date: controller_1.mainExercisTracker.prototype.getDate(log.date).toDateString()
                });
            }
            var resp = {
                _id: req.params.userID,
                username: userLogs.username,
                count: count,
                log: logs
            };
            res.status(200).send(resp);
            return;
        }
        res.status(200).send({ error: 'Not Found' });
    };
    return DefaultExerciseTracker;
}());
exports.DefaultExerciseTracker = DefaultExerciseTracker;
exports.mainExercisTracker = DefaultExerciseTracker;
