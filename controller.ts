import { Request, Response } from "express";
import * as nodeCache from "node-cache"

export interface ExerciseTracker {
    addUser(req: Request, res: Response): void;
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

class DefaultExerciseTracker implements ExerciseTracker {
    addUser(req: Request, res: Response) {
        let newUserID: string = 'u' + Date.now().toString()
        let userObj: UserObj = { username: req.body.username, logs: null }
        cache.set(newUserID, userObj)
        res.status(200).send({ msg: 'yee', userID: newUserID })
    }
    addExercise(req: Request, res: Response) {
        if (cache.has(req.params.userID)) {
            let userLogs: UserObj = cache.get(req.params.userID)
            let userObj: UserObj = userLogs
            let dummyLog: LogObj = {
                date: req.body.date,
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
            let userLogs: UserObj = cache.get(req.params.userID)
            let userObj: UserObj = userLogs
            res.status(200).send({ msg: 'found', logs: userObj.logs })
            return;
        }
        res.status(200).send({ error: 'Not Found' })
    }
}
export { DefaultExerciseTracker as DefaultExerciseTracker };
export { DefaultExerciseTracker as mainExercisTracker };