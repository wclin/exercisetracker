import { Request, Response } from "express";
import nodeCache from "node-cache";
import { mainExercisTracker } from "./controller";

export interface ExerciseTracker {
    addUser(req: Request, res: Response): void;
    findUsers(req: Request, res: Response): void;
    addExercise(req: Request, res: Response): void;
    findExercises(req: Request, res: Response): void;
}

const cache = new nodeCache({ stdTTL: 300 });

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

interface RespExcercisListItem {
    description: string;
    duration: number;
    date: string;
}

interface RespExcercisList {
    _id: string;
    username: string;
    count: number;
    log: RespExcercisListItem[];
}

class DefaultExerciseTracker implements ExerciseTracker {
    private getDate(reqDateStr: string): Date {
        let dateObj: Date = new Date()
        if (reqDateStr) {
            let splitted: string[] = reqDateStr.split("-", 3);
            dateObj.setFullYear(+splitted[0], +splitted[1] - 1, +splitted[2]);
        }
        return dateObj
    }
    addUser(req: Request, res: Response) {
        console.log("[addu]")
        console.log(req.body)
        let newUserID: string = 'u' + Date.now().toString()
        let userObj: UserObj = { username: req.body.username, logs: [] }
        cache.set(newUserID, userObj)
        let resp: RespUser = { _id: newUserID, username: userObj.username }
        res.status(200).send(resp)
    }
    findUsers(req: Request, res: Response) {
        console.log("[findu]")
        console.log(req.params)
        let userIDs: string[] = cache.keys()
        let users: RespUser[] = [];
        userIDs.forEach((userID: string) => {
            let userObj: UserObj = cache.get(userID) || { username: "", logs: [] };
            users.push({ _id: userID, username: userObj.username })
        })
        res.status(200).send(users)
    }
    addExercise(req: Request, res: Response) {
        console.log("[addex]")
        console.log(req.params)
        console.log(req.body)
        if (cache.has(req.params.userID)) {
            let userObj: UserObj = cache.get(req.params.userID) || { username: "", logs: [] };
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
            userObj.logs.push(logObj)
            cache.set(req.params.userID, userObj)
            let dateObj: Date = mainExercisTracker.prototype.getDate(reqDateStr);
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
        console.log("[findex]")
        console.log(req.params)
        console.log(req.query)
        if (cache.has(req.params.userID)) {
            let reqFrom: string = req.query.from as string || "1700-01-01"
            let reqTo: string = req.query.to as string || "2888-12-31"
            let dateFrom: Date = mainExercisTracker.prototype.getDate(reqFrom)
            let dateTo: Date = mainExercisTracker.prototype.getDate(reqTo)
            let limit: number = +(req.query.limit || 100000)
            let count: number = 0
            let userLogs: UserObj = cache.get(req.params.userID) || { username: "", logs: [] };
            let logs: RespExcercisListItem[] = []
            for (let log of userLogs.logs) {
                if (count >= limit) {
                    break;
                }
                let dateObj: Date = mainExercisTracker.prototype.getDate(log.date)
                if (dateObj < dateFrom || dateObj > dateTo) {
                    continue;
                }
                count = count + 1;
                logs.push({
                    description: log.desc,
                    duration: log.duration,
                    date: mainExercisTracker.prototype.getDate(log.date).toDateString(),
                })
            }
            let resp: RespExcercisList = {
                _id: req.params.userID,
                username: userLogs.username,
                count: count,
                log: logs,
            }
            res.status(200).send(resp)
            return;
        }
        res.status(200).send({ error: 'Not Found' })
    }
}
export { DefaultExerciseTracker as DefaultExerciseTracker };
export { DefaultExerciseTracker as mainExercisTracker };