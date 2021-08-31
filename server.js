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
        let arrayFinal = [];
        //console.log(shopItemArray);

        for (let i = 0; i < shopItemArray.length; i++){
            // let item = shopItemArray[i];

            // console.log(item, item[item.length - 2])

            // if (item[item.length - 2] === '\\'){
            //     console.log('got here! ' + item);
            // } else {
            //     console.log('no slashes at the end');
            // }
            arrayFinal.push(shopItemArray[i]);
            //arrayFinal.push(item[item.length - 2] === '\\' ? item.substring(0, item.length - 1) : item);
        }

        // const fixedShopItemArray = shopItemArray.map((item) => {
        //     //console.log('item: ', item)
        //     return item;
        //     //arrayFinal.push(item);
        //     //console.log('character: ', item[item.length - 2]);
        //     if (item[item.length - 2] === '\\') {
        //         // console.log(item.substring(0, item.length - 1))
        //         let holder = item.substring(0, item.length - 1);
        //         //return item.substring(0, item.length - 1);
        //         //console.log('holder: ' + holder);
        //         return holder;
        //     }
        //     return;
        // })
        console.log('finalArray: ' + arrayFinal);
        //console.log(fixedShopItemArray);

        response.end(JSON.stringify(arrayFinal));
    })
});

app.listen(80);
