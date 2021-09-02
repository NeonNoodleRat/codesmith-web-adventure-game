$(document).ready(function(){
    $('.player-text-box').keypress(function(e){
        // user pressed the enter key
        if (e.keyCode === 13){
            // empty out textbox and put the text they entered above
            let textBoxValue = $(".player-text-box").val();

            // always add what the user typed before advancing game stage
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
                case 'shopPrompt':
                    shopKeeper();
                    break;
                case 'shop':
                    checkPurchaseOrExit(textBoxValue);
                    break;
                case 'startQuest':
                    startQuest(textBoxValue);
                    break;
                case 'fight':
                    break;
                case 'persuasion':
                    break;
                case 'win':
                    break;
                case 'lose':
                    break;
                case 'investigatePrompt':
                    break;
                case 'encounterPrompt':
                    encounterPrompt(textBoxValue);
                    break;
                case 'fightOrTalk':
                    fightOrTalk(textBoxValue);
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
            gameState.stage = 'shopPrompt';

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

        gameState.stage = 'shop';
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

        if (selectedItem != null){
            addToScreenText(`${selectedItem.name} added to your inventory. Excellent choice. Good luck on your adventures!`, "computer");

            userState.coin = userState.coin - selectedItem.cost;
            userState.otherInventory = selectedItem.name;
            $('.character-stats .gold').text(`Gold: ${userState.coin}`);
            $('.character-stats .other').text(`Other: ${selectedItem.name}`);
        }

        gameState.stage = 'startQuest'
        addToScreenText('Time to hit the road! You leave town on the dusty path leading south and walk for a few uneventful hours until you come upon a fork in the road. Do you go left or right?', "computer");

        $('.player-text-box').attr("placeholder", "left or right?");
    }

    function startQuest(playerInput){
        if (playerInput !== 'left' && playerInput !== 'right'){
            addToScreenText("Not a valid input. Please input 'left' or 'right'", "computer");
        } else {
            addToScreenText(`You head down the ${playerInput} side of the path. After a few minutes you hear a rustling in some nearby bushes. Do you investigate?`, "computer");
            $('.player-text-box').attr("placeholder", "yes or no?");
            gameState.stage = 'encounterPrompt';
        }
    }

    function encounterPrompt(playerInput){
        userState.currentMonster = getRandomMonster();

        if (playerInput !== 'yes' && playerInput !== 'no'){
            addToScreenText("Not a valid input. Please input 'yes' or 'no'", "computer");
        } else {
            switch (playerInput){
                case "yes":
                    addToScreenText(`You run up to the bush and peek inside only for a ${userState.currentMonster.name} to jump out with an angry stance!`, "computer");
                    break;
                case "no":
                    addToScreenText(`You decide that's a problem for someone else and begin to walk away when suddenly a ${userState.currentMonster.name} jumps out of the bush at you, with a sinister stance!`, "computer");
                    break;
            }

            addToScreenText(`Do you want to try to fight or talk?`, "computer");
            $('.player-text-box').attr("placeholder", "fight or talk?");

            gameState.stage = 'fightOrTalk';
        }
    }

    function fightOrTalk(playerInput){
        if (playerInput !== 'fight' && playerInput !== 'talk'){
            addToScreenText("Not a valid input. Please input 'fight' or 'talk'", "computer");
        } else {
            switch (playerInput){
                case "fight":
                    addToScreenText(`You pull out your ${userState.weapon} and prepare for battle!`, "computer");
                    fight();
                    break;
                case "talk":
                    addToScreenText(`You slowly lay down your ${userState.weapon} and begin to try to reason with the ${userState.currentMonster.name}`, "computer");
                    talk();
                    break;
            }

            addToScreenText(`Do you want to try to fight or talk?`, "computer");
            $('.player-text-box').attr("placeholder", "");
        }
    }

    function fight(){

    }

    function talk(){
        if (userState.otherInventory === 'fancy hat'){
            addToScreenText(`The ${userState.currentMonster.name} notices your fancy hat. Your hat pleases the ${userState.currentMonster.name}. They like it so much they toss you a coin and go back to crouching in their bush.`, "computer");
            addToScreenText(`5 gold added to your stash.`, "computer");

            userState.coin = userState.coin + 5;

            $('.gold').text(`Gold: ${userState.coin}`);
        } else {
            let result = Math.abs(Math.ceil((Math.random() * 2)-1));

            // 0 is fail, 1 is pass
            if (result === 0){
                addToScreenText(`The ${userState.currentMonster.name} scowls at your attempt to make peace with words and lunges at you.`, "computer");
                addToScreenText(`Prepare to fight!`, "computer");
            } else if (result === 1){
                addToScreenText(`The ${userState.currentMonster.name} shouts "I like your funny words magic man! They toss you 5 gold and go back to crouching in their bush."`, "computer");
            }
        }
    }

    function investigatePrompt(playerInput){
        if (playerInput !== 'yes' && playerInput !== 'no'){
            addToScreenText("Not a valid input. Please input 'yes' or 'no'", "computer");
        } else {
            addToScreenText(`You head down the ${playerInput} side of the path. After a few minutes you hear a rustling in some nearby bushes. Do you investigate?`, "computer");
            $('.player-text-box').attr("placeholder", "yes or no?");
            gameState.stage = 'investigatePrompt';
        }
    }

    //need session for this function
    //https://codeforgeek.com/manage-session-using-node-js-express-4/
    //check if the username already exists
    function usernameAlreadyExists(username){
        return false;
    }
});