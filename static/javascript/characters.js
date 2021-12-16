const url = "http://localhost:3000";
const imgUrl = "..";


import { GameClass } from './Classes/GameClass.js';
let game = new GameClass();
let selected = [];

function gameLog(str, color = "cadetblue") {
    document.getElementById("game-log").innerHTML = `<p style="background-color: ${color}"> - ${str}</p>` + document.getElementById("game-log").innerHTML;   
}

function generateHTML() {
    let output = '';
    output += `<div class="char-content">`
    for (let char in game.characterList) {
        output += `<div class="char-container"><img src="${imgUrl}/images/${char} Sprite.png" class="sprite" id="${char}">
                    <table id=${char} class="unitTab">\
            <th>${char} </th>`;
        // Display all character fields
        for (let field in game.characterList[char]) {
            if (field != 'id_characters' && field != 'attackList' && field != 'supportList') {
                if (field == 'HP_max' || field == 'HP_current' || field == 'AP_current' || field == 'ESS_Max' || field == 'ESS_current' || field == 'tension') {
                    output += `<tr>\
                <td>${field}</td>\
                <td>${game.characterList[char][field]}</td>\
                </tr>`;
                }
            }
        }
        // Display character attacks and supports

        output += '</table> </div>';
    }
    output += `</div>`

    //dramatic spacing
    output += '<div class="spacing"> </div>'

    // Enemy table generation

    output += `<div class="en-content">`
    for (let enemy in game.enemyList) {
        output += `<div class="enemy-container"><img src="${imgUrl}/images/${enemy.split("_")[0]} Sprite.png" class="sprite"> 
        <table id=${enemy}tab class="enTab">\
            <th>${enemy} </th>`;
        // Display all enemy fields
        for (let field in game.enemyList[enemy]) {
            if (field != 'id_enemys' && field != 'attackList' && field != 'supportList') {
                if (field == 'HP_max' || field == 'HP_current' || field == 'AP_current' || field == 'ESS_Max' || field == 'ESS_current' || field == 'tension') {
                    output += `<tr>\
                <td>${field}</td>\
                <td>${game.enemyList[enemy][field]}</td>\
                </tr>`;
                }
            }
        }
        output += `</table> </div>`;
    }
    output += `</div>`
    document.getElementById("container").innerHTML = output;
}


function generateGame(inData, enemyData) {
    let characterList = {};
    for (let entry in inData) {
        const xhttpSupports = new XMLHttpRequest();
        // Make sure the response is syncronous
        console.log(inData[entry].char_name, inData[entry].id_characters);
        xhttpSupports.open('GET', `${url}/getActions/characters/supports/${inData[entry]['id_characters']}`, false);
        xhttpSupports.onload = function () {
            // Parse the data from the response
            const supports = JSON.parse(xhttpSupports.responseText);
            // If there are any entries in the response
            inData[entry].supportList = {};
            for (let support in supports) {
                // Make rows in the table for the supports
                inData[entry].supportList[supports[support].support_name] = supports[support];
            }
        }
        xhttpSupports.send();
        // Make a request for the supports used for that unit
        const xhttpAttacks = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpAttacks.open('GET', `${url}/getActions/characters/attacks/${inData[entry]['id_characters']}`, false);
        xhttpAttacks.onload = function () {
            // Parse the data from the response
            const attacks = JSON.parse(xhttpAttacks.responseText);
            // If there are any entries in the response
            inData[entry].attackList = {};
            for (let attack in attacks) {
                // Make rows in the table for the attacks
                inData[entry].attackList[attacks[attack].attack_name] = attacks[attack];
            }
        }
        xhttpAttacks.send();
        characterList[inData[entry].char_name] = inData[entry];
    }
    console.log(characterList);
    // Populate characterList based on charSelected
    
    let enemyList = {};
    for (let entry in enemyData) {
        console.log("ENTRY: ", enemyData[entry]);
        const xhttpSupports = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpSupports.open('GET', `${url}/getActions/enemys/supports/${enemyData[entry]['id_enemys']}`, false);
        xhttpSupports.onload = function () {
            // Parse the data from the response
            const supports = JSON.parse(xhttpSupports.responseText);
            // If there are any entries in the response
            enemyData[entry].supportList = {};
            for (let support in supports) {
                // Make rows in the table for the supports
                enemyData[entry].supportList[supports[support].support_name] = supports[support];
            }
        }
        xhttpSupports.send();
        // Make a request for the supports used for that unit
        const xhttpAttacks = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpAttacks.open('GET', `${url}/getActions/enemys/attacks/${enemyData[entry]['id_enemys']}`, false);
        xhttpAttacks.onload = function () {
            // Parse the data from the response
            const attacks = JSON.parse(xhttpAttacks.responseText);
            // If there are any entries in the response
            enemyData[entry].attackList = {};
            for (let attack in attacks) {
                // Make rows in the table for the attacks
                enemyData[entry].attackList[attacks[attack].attack_name] = attacks[attack];
            }
        }
        xhttpAttacks.send();
        enemyList[enemyData[entry].enemy_name + `_${enemyData[entry].num}`] = enemyData[entry];
    }
    console.log(enemyList);

    game.populateCharacters(characterList);
    game.populateEnemys(enemyList);
    game.populateGame();

    generateHTML();
    document.getElementById("endTurnBtn").addEventListener("click",takeTurn);
    takeTurn();
}

function generateAttackMenu(char) {
    selected = [];
    let output = '';
    output += `<label>${char}: </label>`;
    for (let attack in game.characterList[char].attackList) {
        output += `<input type=submit value="${attack}" id="${attack}" class="menu"></input>`
    }
    document.getElementById("menu").innerHTML = output;
    generateAttackListeners(char);
}

function generateAttackListeners(char) {
        for (let attack in game.characterList[char].attackList) {
            let action =  document.getElementById(attack);
            action.char = char;
            action.addEventListener("click", generateTargets)
        }
}

function generateTargets() {
    let targets = game.characterList[this.char].attackList[this.id].targets;
    // Determine correct number of targets
    let enemyKeys = Object.keys(game.enemyList).length;
    let minTargets;
    // Make sure the minimum number of targets is selected
    if (targets < enemyKeys) {
        minTargets = targets;
    }
    else {
        minTargets = enemyKeys;
    }
    let output = `<p>Select ${minTargets} target${(minTargets != 1) ? "s" : ""} --`;
    // Create Checkboxes
    for (let enemy in game.enemyList) {
        output += `<input type="checkbox" value="${enemy}" id="${enemy}" class="menu">${enemy}</input> -- `
    }
    output += `<input type="button" id="performAttack" value="OK"></input>`;
    document.getElementById("menu").innerHTML = output;
    // Attach Listeneers to checkboxes
    generateTargetListeners(this.id, this.char);
}

function targetClick() {
    if(this.checked) {
        selected.push(this.id);
    }
    else {
        let index = selected.indexOf(this.id);
        selected.splice(index, 1);
    }
    console.log(selected);
}

function generateTargetListeners(attack,char) {

    for (let enemy in game.enemyList) {
        document.getElementById(enemy).addEventListener("click", targetClick);
    }
    let listener = document.getElementById("performAttack",);
    listener.attack = attack;
    listener.char = char;
    listener.targets = game.characterList[char].attackList[attack].targets;
    listener.addEventListener("click", executeAttack);
}

function executeAttack() {
    let check = false;
    for (let enemy in game.enemyList) {
        if (document.getElementById(enemy).checked) {
            check = true;
        }
    }
    if (check) {
        let targets = [];
        let enemyKeys = Object.keys(game.enemyList).length;
        let minTargets;
        // Make sure the minimum number of targets is selected
        if (this.targets < enemyKeys) {
            minTargets = this.targets;
        }
        else {
            minTargets = enemyKeys;
        }
        // Perform the attack on the selected targets
        if (selected.length == minTargets) {
            for (let enemy in selected) {
                let target = {
                    char_name: selected[enemy],
                    char_def: game.enemyList[selected[enemy]].def,
                    char_agi: game.enemyList[selected[enemy]].agi,
                    char_tension: game.enemyList[selected[enemy]].tension
                }
                targets.push(target);
            }
            gameLog(`${this.char} used ${this.attack}`);
            const damageData = game.characterList[this.char].selectAttackTargets(this.attack, targets);
            playerTakeTurn(damageData,this.char);
        }
        // Invalid number of targets
        else {
            console.log("Incorrect Number");
            gameLog("Please select the correct number of targets");
        }
    }
    // No targets
    else {
        console.log("select a target");
        gameLog("No targets were selected");
    }
}


let currentUnit = 0;

function takeTurn() {
    enemyLives();

    let unit = "";
    // Check who's turn it is
    if (currentUnit < Object.keys(game.turnOrder).length) {
        unit = Object.keys(game.turnOrder)[currentUnit];
    }
    else {
        currentUnit = 0;
        unit = Object.keys(game.turnOrder)[currentUnit];
    }
    currentUnit += 1;

    if (game.turnOrder[unit] == 'enemy') {
        console.log("ENEMY_TURN: ", unit);
        gameLog(`ENEMEY TURN: ${unit}`, "rgb(250, 136, 115)");
        // Enemy turn, fully automated
        const enemy = game.enemyList[unit];
        // Gains AP at start of turn
        enemy.startTurn();
        // Get updated character data for aggro table
        for (let char in game.characterList) {
            enemy.changeAggro(char, 0, game.characterList[char].state.status);
        }
        // Enemy uses each attack at its disposal for now
        //	(if it has enough AP)
        for (let attack in enemy.attackList) {
            gameLog(`${unit} used ${attack}`, "rgb(199, 131, 110)");
            const damageData = enemy.selectAttackTargets(attack);
            console.log(damageData);
            // End turn if it doesn’t have enough AP
            if (damageData == 'not enough ap') {
                gameLog(`But ${unit} didn't have enough AP`, "rgb(199, 131, 110)");
                break;
            }
            else {
                // For each character that was targeted
                for (let char_name in damageData) {
                    // For each time the character was hit by the attack
                    for (let entry in damageData[char_name]) {
                        // Record if the attack was blocked, evaded, or taken
                        let res = "";
                        if (damageData[char_name][entry].result == "Miss") {
                            res = "missed";
                        }
                        else if (damageData[char_name][entry].result == "Hit") {
                            res = "hit";
                        }
                        else if (damageData[char_name][entry].result == "Crit") {
                            res = "critically hit";
                        }
                        gameLog(`${unit} ${res} ${char_name}`, "rgb(199, 131, 110)");
                        const baseDamage = damageData[char_name][entry].damage;
                        const target = game.characterList[char_name]
                        const takeData = target.takeDamage(baseDamage);
                        console.log(char_name, takeData);
                        if (takeData.result != "taken" && takeData.result != "miss") {
                            gameLog(`${char_name} ${takeData.result}`, "rgb(199, 131, 110)");
                        }
                        if (takeData.damage != 0) {
                            gameLog(`${char_name} took ${takeData.damage} damage`, "rgb(199, 131, 110)");
                        }
                        // Change the aggro of the enemy towards the character
                        const char_status = target.state.status;
                        const aggroChange = 0 - damageData[char_name][entry].aggro;
                        enemy.changeAggro(char_name, aggroChange, char_status);
                        if (char_status == "Incapacitated") {
                            gameLog(`${char_name} was defeated`, "rgb(199, 131, 110)");
                        }
                        enemyLives();
                        generateHTML();
                    }
                }
            }
        }
        takeTurn();
    }
    else if (game.turnOrder[unit] == 'character') {
        console.log("CHARACTER_TURN: ", unit);
        gameLog(`CHARACTER TURN ${unit}`, "rgb(98, 178, 180)");
        // Character Turn (Needs Player Input) 
        const character = game.characterList[unit];
        if (character.state.status == "Incapacitated") {
            takeTurn();
        }
        else {
            character.startTurn();
            generateHTML();
            generateAttackMenu(unit);

        }
    }
    
}

// When a player uses an attack against an enemy
function playerTakeTurn(damageData, char) {
    console.log(damageData);
    if (damageData == 'not enough ap') {
        gameLog(`But ${char} didn't have enough AP`);
        generateAttackMenu(char);
    }
    else {
        for (let enemy_name in damageData) {
            // For each time the enemy was hit by the attack
            for (let entry in damageData[enemy_name]) {
                if (game.enemyList[enemy_name]) {
                    // Record if the attack was blocked, evaded, or taken
                    let res = "";
                    if (damageData[enemy_name][entry].result == "Miss") {
                        res = "missed";
                    }
                    else if (damageData[enemy_name][entry].result == "Hit") {
                        res = "hit";
                    }
                    else if (damageData[enemy_name][entry].result == "Crit") {
                        res = "critically hit";
                    }
                    gameLog(`${char} ${res} ${enemy_name}`)
                    // Record if the attack was blocked, evaded, or taken
                    const baseDamage = damageData[enemy_name][entry].damage;
                    const target = game.enemyList[enemy_name]
                    const takeData = target.takeDamage(baseDamage);
                    console.log(enemy_name, takeData);
                    if (takeData.result != "taken" && takeData.result != "miss") {
                        gameLog(`${enemy_name} ${takeData.result}`);
                    }
                    if (takeData.damage != 0) {
                        gameLog(`${enemy_name} took ${takeData.damage} damage`);
                    }
                    // Change the aggro of the enemy towards the character
                    const aggroChange = damageData[enemy_name][entry].aggro;
                    console.log(char, aggroChange, game.characterList[char].state.status);
                    target.changeAggro(char, aggroChange, game.characterList[char].state.status);
                   
                    enemyLives();
                    generateHTML();

                } 
            }
        }

    }
    generateAttackMenu(char);
}

//checks win/lose conditons
function enemyLives() {
    console.log("enemy lives check");

    //are all enemies dead?
    let allEnemy = true;

    //are all characters dead?
    let allChar = true;

    //is the game over?
    let thisGame = false;

    //two for loops check if all enemies or characters are at hp 0 and sets values accordingly.
    for (let enemy in game.enemyList) {
        if (game.enemyList[enemy].HP_current != 0) {
            thisGame = true;
            allEnemy = false;
        }
        // Remove defeated enemies from the game
        else {
            delete game.enemyList[enemy];
            delete game.turnOrder[enemy];
            console.log("TURN ORDER UPDATED: ",game.turnOrder);
            gameLog(`${enemy} was defeated`);
        }
    }
    for (let char in game.characterList) {
        if (game.characterList[char].HP_current != 0) {
            thisGame = true;
            allChar = false;
        }
    }
    if (allEnemy) {
        //you win
        console.log("all enemies are dead");
        window.alert("All your enemies are dead. Victory")
    }
    if (allChar) {
        //you lost
        console.log("all characters are dead")
        window.alert("Your party are dead. Your story ends here.")
    }
    return thisGame;
}

window.onload = function () {
    // Get data from database
    let queryStr = (location.href);
    queryStr = queryStr.split("?").slice(-1)[0];
    let queryArray = queryStr.split("&");
    let queryList = [];
    for (let entry in queryArray) {
        let type = queryArray[entry].split("-")[0];
        let val = queryArray[entry].split("-")[1];
        queryList.push({type: type, id: val.split("=")[0], num: val.split("=")[1]});
    }

        let charList = {};
        let enList = {};

        for (let entry in queryList) {
            for (let num = 1; num <= queryList[entry].num; num++) {
                let query = queryList[entry];
                const request = new XMLHttpRequest();
                request.open('GET', `${url}/getUnit/${query.type}/${query.id}`, false);
                request.onload = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            if (query.type == "characters") {
                                charList[entry] = JSON.parse(request.responseText)[0];
                            }
                            else {    
                                enList[entry + "_" + num] = JSON.parse(request.responseText)[0];
                                enList[entry + "_" + num].num = num;
                            }
                        }
                    }
                };
                request.send();
            }
        }
        generateGame(charList, enList);

}