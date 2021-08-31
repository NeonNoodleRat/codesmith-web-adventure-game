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
                    // response to second adventure text prompt
                    shopKeeper();
                    break;
                case 'startQuest':
                    // response to third adventure text prompt
                    break;
                case 'fight':
                    // last game stage, they either on or lost
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
        $.ajax({
            method: 'GET',
            url: window.location.href + 'getShopInventory',
            success: function(shopItems){
                addToScreenText("( ͡° ͜ʖ ͡°)", "computer");
                addToScreenText("Welcome to my shop adventurer, persue my goods.", "computer");
                debugger;
                $.each(shopItems, function(key, item) {
                    debugger;
                    addToScreenText(item, computer);
                });
            },
            error: function(){
                alert('wompwomp');
            }
        });
    }

    //need session for this function
    //https://codeforgeek.com/manage-session-using-node-js-express-4/
    //check if the username already exists
    function usernameAlreadyExists(username){
        return false;
    }
});