$(document).ready(function(){
    class Monster {
        constructor(name, health, gold){
            // this.name = "Goblin";
            // this.health = 5;
            // this.gold = 2;
        }

        introduce() {
            return `Ah! I'm a ${this.name} and I'm here to fight!`;
        }
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

    let goblin = new Monster("Goblin", 5, 2);

    let userState = 
    {
        username: '',
        inAdventure: false,
        weapon: 'dagger',
        health: 20,
        armor: 'light',
        coin: 50
    }

    let gameState = 
    {
        // login
        // questPrompt
        // startQuest
        // shop
        // persuasion
        // fight
        // win 
        // lose
        stage: 'login'
    }

    $('.player-text-box').keypress(function(e){
        // user pressed the enter key
        if (e.keyCode === 13){
            // empty out textbox and put the text they entered above
            let textBoxValue = $(".player-text-box").val();

            // always add what the user inputed before advancing game stage
            addToScreenText(textBoxValue, 'user');

            switch(gameState.stage){
                case 'login':
                    // they entered their username
                    loginStage(textBoxValue);
                    break;
                case 'questPrompt':
                    // response to first adventure text prompt
                    acceptOrDeclineQuest(textBoxValue);
                    break;
                case 'shop':
                    checkPurchaseOrExit(textBoxValue);
                    shopKeeper();
                    break;
                case 'startQuest':
                    break;
                case 'fight':
                    break;
                case 'persuasion':
                    break;
                case 'win':
                    break;
                case 'lose':
                    break;
            }
        }
    });

    function addToScreenText(newText, userOrComputer){
        var $newTextContainer = $('<div></div>');
        $newTextContainer.addClass('single-line-text-container');

        var $newText = $('<span></span>');

        // makes the text green or white depending on if the user entered the text
        if (userOrComputer === 'user'){
            $newText.addClass('player-text');
        } else if (userOrComputer === 'computer') {
            $newText.addClass('game-text');
        }
        
        $newText.text(newText);
        $newTextContainer.append($newText);
        $('.screen-text-container').append($newTextContainer);

        $('.player-text-box').val('')
    }

    function loginStage(username){
        if (usernameAlreadyExists(username) === true) {
            // do something to say that username is already in use
        }
        
        $.ajax({
            method: 'GET',
            url: window.location.href + 'getAdventurePrompts',
            success: function(prompt){
                userState.username = username;

                $('.character-stats .username').text('Name: ' + username);
                $('.character-stats').show();

                addToScreenText(prompt, "computer");
                $('.player-text-box').attr("placeholder", "yes or no?");

                gameState.stage = 'questPrompt';
            },
            error: function(){
                alert('wompwomp');
            }
        });
    }

    function acceptOrDeclineQuest(textBoxValue){
        let answer = textBoxValue.toLowerCase();

        if (answer === 'yes'){
            addToScreenText(`Congratulations ${userState.username}! Before you leave town would you like to visit the shop?`, "computer");

            $('.player-text-box').attr("placeholder", "yes or no?");
            gameState.stage = 'shop';

        } else if (answer === 'no'){
            addToScreenText("Okay, off you go!", "computer");
            gameState.stage = 'startQuest';

        } else {
            addToScreenText("Not a valid input. Please respond with 'yes' or 'no'", "computer");
        }
    }

    function shopKeeper(){
        addToScreenText('( ͡° ͜ʖ ͡°)', "computer");
        addToScreenText('Welcome to my shop. Enter an item\'s corresponding number to purchase an item or type exit to leave.', "computer");

        $('.player-text-box').attr("placeholder", "");
        for (let i = 0; i < shopItems.length; i++) {
            let displayString = `${shopItems[i].selectNumber} ${shopItems[i].name} ${shopItems[i].getDisplayCost()}`
            addToScreenText(displayString, "computer");
        }
    }

    function checkPurchaseOrExit(playerInput){
        let selectedItem = null;
        switch(playerInput){
            case '1':
                selectedItem = shopItemsList.Select("selectNumber", 1);
                break;
            case '2':
                selectedItem = shopItemsList.Select("selectNumber", 2);
                break;
            case '3':
                selectedItem = shopItemsList.Select("selectNumber", 3);
                break;
            case 'exit':
                addToScreenText("See ya!", "computer");
                break;
            default:
                addToScreenText("Not a valid input. Please input '1', '2', '3', or 'exit", "computer");
        }

        debugger;
    }

    //need session for this function
    //https://codeforgeek.com/manage-session-using-node-js-express-4/
    //check if the username already exists
    function usernameAlreadyExists(username){
        return false;
    }
});