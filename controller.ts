import { Request, Response } from "express";
import * as nodeCache from "node-cache"

export interface ExerciseTracker {
    addUser(req: Request, res: Response): void;
    findUsers(req: Request, res: Response): void;
    addExercise(req: Request, res: Response): void;
    findExercises(req: Request, res: Response): void;
}

const cache = new nodeCache({ stdTTL: 60 });

interface LogObj {
    date: string;
    desc: string;
    duration: number;
}

interface UserObj {
    username: string;
    logs: LogObj[];
}

interface RespUser {
    _id: string;
    username: string;
}

interface RespAddExercise {
    _id: string;
    username: string;
    date: string;
    duration: number;
    description: string;
}

class DefaultExerciseTracker implements ExerciseTracker {
    addUser(req: Request, res: Response) {
        let newUserID: string = 'u' + Date.now().toString()
        let userObj: UserObj = { username: req.body.username, logs: null }
        cache.set(newUserID, userObj)
        let resp: RespUser = {_id: newUserID, username: userObj.username}
        res.status(200).send(resp)
    }
    findUsers(req: Request, res: Response) {
        let userIDs: string[] = cache.keys()
        let users: RespUser[] = [];
        userIDs.forEach((userID: string) => {
            let userObj: UserObj = cache.get(userID)
            users.push({_id: userID, username: userObj.username})
        })
        res.status(200).send(users)
    }
    addExercise(req: Request, res: Response) {
        if (cache.has(req.params.userID)) {
            let userLogs: UserObj = cache.get(req.params.userID)
            let userObj: UserObj = userLogs
            let reqDateStr: string = req.body.date
            let dateStr: string = function (reqDateStr: string) {
                if (reqDateStr === "") {
                    let today: Date = new Date()
                    let year: string = today.getFullYear().toString()
                    let month: string = (today.getMonth() + 1).toString()
                    let date: string = today.getDate().toString()
                    return `${year}-${month}-${date}`
                }
                return reqDateStr;
            }(reqDateStr);
            let logObj: LogObj = {
                date: dateStr,
                desc: req.body.description,
                duration: req.body.duration
            }
            if (userObj.logs != null) {
                userObj.logs.push(logObj)
            } else {
                userObj.logs = [logObj]
            }
            cache.set(req.params.userID, userObj)
            let dateObj: Date = new Date()
            if (reqDateStr !== "") {
                let splitted: string[] = reqDateStr.split("-", 3)
                dateObj.setFullYear(+splitted[0], +splitted[1]+1, +splitted[2])
            }
            let resp: RespAddExercise = {
                _id: req.params.userID,
                username: userObj.username,
                date: dateObj.toDateString(),
                duration: logObj.duration,
                description: logObj.desc,
            }
            res.status(200).send(resp)
            return;
        }
        res.status(200).send({ error: 'not found' })
    }
    findExercises(req: Request, res: Response) {
        if (cache.has(req.params.userID)) {
            // TODO: date filter with from/to param
            // TODO: limit param
            let userLogs: UserObj = cache.get(req.params.userID)
            let userObj: UserObj = userLogs
            res.status(200).send({ msg: 'found', log: userObj.logs })
            // TODO: format
            // TODO: add count(len of log)
            return;
        }
        res.status(200).send({ error: 'Not Found' })
    }
}
export { DefaultExerciseTracker as DefaultExerciseTracker };
export { DefaultExerciseTracker as mainExercisTracker };