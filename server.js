const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
const { response } = require('express');

// const startAdventure = (req, res, next) => {
//     // server the static (ish) web page to start the adventure
//     res.sendFile('./index.html');
// }

app.use(express.json());
//app.get('/adventure', startAdventure);
//app.use('/', () => res.status(418).send('page not found'));

// this one works to serve a static file
//app.use('/adventure', express.static('index.html'));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/getAdventurePrompts', function(request, response){
    fs.readFile('random_encounters.txt', (err, data) => {
        if (err) throw err;
        response.end(data);
    });
});

app.listen(80);
