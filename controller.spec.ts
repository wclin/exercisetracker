import express from 'express'
import { mainExercisTracker } from './controller'

describe('add user', () => {
    test('should success', () => {
        const mockRequest = {
            body: {
                username: 'wccc',
            },
        } as express.Request;
        let mockResponse = {} as express.Response
        mockResponse.status = function (c: number): express.Response { return mockResponse; }
        mockResponse.send = function (d: any): express.Response { return mockResponse; }
        const addUser = mainExercisTracker.prototype.addUser(mockRequest, mockResponse)
        expect(addUser).toEqual(undefined)
    })
})

// duration from POST /api/users/:_id/exercises and GET /api/users/:id/logs should be number instead of text
describe('add exercise', () => {
    test('duration should be number', () => {
        const mockRequest = {
            body: {
                date: '2021-09-07',
                description: 'aaa',
                duration: '56',
            },
            params: {},
        } as express.Request;
        mockRequest.params['userID'] = 'u5566'
        const addExercise = mainExercisTracker.prototype.addExercise(mockRequest)
        expect(addExercise).toEqual({
            _id: 'u5566',
            username: '',
            date: 'Tue Sep 07 2021',
            description: 'aaa',
            duration: 56,
        })
    })
})