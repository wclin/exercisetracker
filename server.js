const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({
  extended: true
}));

// Exercise tracker endpoint
var ctrl = require('./controller');
let tracker = new ctrl.DefaultExerciseTracker();
app.get('/api/users/:userID/logs', tracker.findExercises);
app.get('/api/users', tracker.findUsers);
app.post('/api/users', tracker.addUser);
app.post('/api/users/:userID/exercises', tracker.addExerciseHandler);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
