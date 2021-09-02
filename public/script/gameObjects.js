class Monster {
    constructor(name, health, gold){
        this.name = name;
        this.health = health;
        this.gold = gold;
    }

    introduce() {
        return `Ah! I'm a ${this.name} and I am angry!`;
    }
}

let monsters = [];
let goblin = new Monster("Goblin", 7, 2);
let kobold = new Monster("Kobold", 5, 2);
monsters.push(goblin);
monsters.push(kobold);

function getRandomMonster(){
    let randoNum = Math.ceil((Math.random() * monsters.length) - 1);
    return monsters[randoNum];
}

class ShopItem {
    constructor(selectNumber, name, cost){
        this.selectNumber = selectNumber;
        this.name = name;
        this.cost = cost;
    }

    getDisplayCost(){
        return this.cost + ' gold';
    }
}

// a function to dump JS arrays into 
// so i can add search functions to mimic list type from C#
class List {
    constructor(javascriptArray){
        this.list = javascriptArray
    }

    Select(property, value){
        for (let i = 0; i < this.list.length; i++){
            for (const propertyName in this.list[i]){
                if (property === propertyName && this.list[i][property] === value) {
                    return this.list[i];
                }
            }
        }

        return null;
    }
}

let shopItems = [];
shopItems.push(new ShopItem(1, "health potion", 10));
shopItems.push(new ShopItem(2, "fancy hat", 10));
shopItems.push(new ShopItem(3, "sword", 10));

let shopItemsList = new List(shopItems);

let userState = 
{
    username: '',
    inAdventure: false,
    weapon: 'dagger',
    health: 20,
    armor: 'light',
    coin: 50,
    currentMonster: null,
    otherInventory: null,
    continueFight: false,
    intervalId: null
}

let gameState = 
{
    // login
    // questPrompt
    // startQuest
    // shopPrompt
    // shop
    // persuasion
    // fight
    // win 
    // lose
    stage: 'login'
}