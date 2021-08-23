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
        res.status(200).send({ msg: 'yee', userID: newUserID });
    };
    DefaultExerciseTracker.prototype.addExercise = function (req, res) {
        if (cache.has(req.params.userID)) {
            var userLogs = cache.get(req.params.userID);
            var userObj = userLogs;
            var dummyLog = {
                date: req.body.date,
                desc: req.body.description,
                duration: req.body.duration
            };
            if (userObj.logs != null) {
                userObj.logs.push(dummyLog);
            }
            else {
                userObj.logs = [dummyLog];
            }
            console.log(userObj);
            cache.set(req.params.userID, userObj);
            res.status(200).send({ msg: 'found' });
            return;
        }
        res.status(200).send({ msg: 'yee' });
    };
    DefaultExerciseTracker.prototype.findExercises = function (req, res) {
        if (cache.has(req.params.userID)) {
            var userLogs = cache.get(req.params.userID);
            var userObj = userLogs;
            res.status(200).send({ msg: 'found', logs: userObj.logs });
            return;
        }
        res.status(200).send({ error: 'Not Found' });
    };
    return DefaultExerciseTracker;
}());
exports.DefaultExerciseTracker = DefaultExerciseTracker;
exports.mainExercisTracker = DefaultExerciseTracker;
