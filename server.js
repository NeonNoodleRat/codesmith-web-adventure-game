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

// TODO: maybe add something to read it in chunks later
// TODO: figure how map works
//  ["health potion - 10 gold\r", "fancy hat - 30 gold\r", "sword - 30 gold\r", ""]
app.get('/getShopInventory', function(request, response) {
    fs.readFile('shop_inventory.txt', (err, data) => {
        if (err) {
            console.log('IN ERROR')
            throw err;
        }

        let shopItemArray = data.toString().split('\n');
        // let arrayFinal = [];

        // for (let i = 0; i < shopItemArray.length; i++){
        //     console.log('item: ' + shopItemArray[i]);
        //     arrayFinal.push(shopItemArray[i]);
        // }

        // //console.log('finalArray: ' + arrayFinal);
        // //console.log('finalArray! terminal glitch check for long strings');
        // for (let i = 0; i < arrayFinal; arrayFinal++) {
        //     console.log('line 53', arrayFinal[i]);
        // }

        // response.end(JSON.stringify(arrayFinal));

        //response.end(JSON.stringify(shopItemArray));
        response.status(200).json({data: shopItemArray})
    })
});

app.listen(80);