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
            let dummyLog: LogObj = {
                date: req.body.date, // TODO: current date if not supplied
                desc: req.body.description,
                duration: req.body.duration
            }
            if (userObj.logs != null) {
                userObj.logs.push(dummyLog)
            } else {
                userObj.logs = [dummyLog]
            }
            console.log(userObj)
            cache.set(req.params.userID, userObj)
            res.status(200).send({ msg: 'found' })
            return;
        }
        res.status(200).send({ msg: 'yee' })
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