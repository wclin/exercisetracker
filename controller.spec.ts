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
        mockResponse.status = function(c: number): express.Response {return mockResponse;}
        mockResponse.send = function(d: any): express.Response {return mockResponse;}
        const addUser = mainExercisTracker.prototype.addUser(mockRequest, mockResponse)
        expect(addUser).toEqual(undefined)
    })
})