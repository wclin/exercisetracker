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
