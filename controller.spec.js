"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./controller");
describe('add user', function () {
    test('should success', function () {
        var mockRequest = {
            body: {
                username: 'wccc',
            },
        };
        var mockResponse = {};
        mockResponse.status = function (c) { return mockResponse; };
        mockResponse.send = function (d) { return mockResponse; };
        var addUser = controller_1.mainExercisTracker.prototype.addUser(mockRequest, mockResponse);
        expect(addUser).toEqual(undefined);
    });
});
// duration from POST /api/users/:_id/exercises and GET /api/users/:id/logs should be number instead of text
describe('add exercise', function () {
    test('duration should be number', function () {
        var mockRequest = {
            body: {
                date: '2021-09-07',
                description: 'aaa',
                duration: '56',
            },
            params: {},
        };
        mockRequest.params['userID'] = 'u5566';
        var addExercise = controller_1.mainExercisTracker.prototype.addExercise(mockRequest);
        expect(addExercise).toEqual({
            _id: 'u5566',
            username: '',
            date: 'Tue Sep 07 2021',
            description: 'aaa',
            duration: 56,
        });
    });
});
