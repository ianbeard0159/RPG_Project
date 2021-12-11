const url = "http://localhost:3000";


import { GameClass } from './Classes/GameClass.js';
let game = new GameClass();
let selected = [];
let charSelected = []; 
let numOfLesserEnemy, numOfGreaterEnemy;

// parse window.location.seach string for form data
function getQueryVariable(variable) { 
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}
charSelected.push(getQueryVariable("char_selected_0"));
charSelected.push(getQueryVariable("char_selected_1"));
numOfLesserEnemy = parseInt(getQueryVariable("numberOfLesserEnemy"));
numOfGreaterEnemy = parseInt(getQueryVariable("numberOfGreaterEnemy"));


function generateHTML() {
    let output = '';
    for (let char in game.characterList) {
        output += `<div class="char-container"><img src="../images/${char} Sprite.png" class="sprite" id="${char}">
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

    //dramatic spacing
    output += '<div class="spacing"> </div>'

    // Enemy table generation

    for (let enemy in game.enemyList) {
        output += `<div class="enemy-container"><img src="../images/${enemy} Sprite.png" class="sprite"> 
        <table id=${enemy}tab class="unitTab">\
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
    document.getElementById("container").innerHTML = output;
}

function generateGame(inData, enemyData) {
    for (let entry in inData) {

        // Make a request for the attacks used for that unit
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

        // Make a request for the supports used for that unit
        const xhttpSupports = new XMLHttpRequest();
        // Make sure the response is syncronous
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
    }
    // Populate characterList based on charSelected
    let characterList = {};
    for (let entry in inData) {
        for(let i = 0; i < charSelected.length; i++){
            if(inData[entry].char_name === charSelected[i]){
                characterList[inData[entry].char_name] = inData[entry];
            }
        }
    }
    game.populateCharacters(characterList);

    for (let entry in enemyData) {
        enemyData[entry].attackList = {};
        enemyData[entry].supportList = {};
        // Make a second request for the attacks used for that unit
        const xhttpAttacks = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpAttacks.open('GET', `${url}/getActions/enemys/attacks/${enemyData[entry]['id_enemys']}`, false);
        xhttpAttacks.onload = function () {
            // Parse the data from the response
            const attacks = JSON.parse(xhttpAttacks.responseText);
            // If there are any entries in the response
            for (let attack in attacks) {
                // Make rows in the table for the attacks
                enemyData[entry].attackList[attacks[attack].attack_name] = attacks[attack];
            }
        }
        xhttpAttacks.send();

        // Make a second request for the supports used for that unit
        const xhttpSupports = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpSupports.open('GET', `${url}/getActions/enemys/supports/${enemyData[entry]['id_enemys']}`, false);
        xhttpSupports.onload = function () {
            // Parse the data from the response
            const supports = JSON.parse(xhttpSupports.responseText);
            // If there are any entries in the response
            for (let support in supports) {
                // Make rows in the table for the supports
                enemyData[entry].supportList[supports[support].support_name] = supports[support];
            }
        }
        xhttpSupports.send();
    }

    let enemyList = new Array();
    while(numOfLesserEnemy != 0){
        console.log("creating lesser enemy");
        // 0 for Lesser Enemy
        const enemySelected = 0;
        let eName = enemyData[enemySelected].enemy_name;
        eName = `${enemyData[enemySelected].enemy_name}_${numOfLesserEnemy}`
        enemyList[eName] = enemyData[enemySelected];
        numOfLesserEnemy--;
    }

    while(numOfGreaterEnemy != 0){
        console.log("creating greater enemy");
        // 1 for Greater Enemy
        const enemySelected = 1;
        let eName = enemyData[enemySelected].enemy_name;
        eName = `${enemyData[enemySelected].enemy_name}_${numOfGreaterEnemy}`
        enemyList[eName] = enemyData[enemySelected];
        numOfGreaterEnemy--;
    }

    game.populateEnemys(enemyList);
    game.populateGame();
    console.log(game);
}

function generateAttackMenu(char) {
    let output = '';
    for (let attack in char.attackList) {
        output += `<input type=submit value="${attack}" id="${attack}" class="menu"></input>`
    }
    document.getElementById("menu").innerHTML = output;
    generateAttackListeners(char);
}

function generateAttackListeners(char) {
        for (let attack in char.attackList) {
            let action =  document.getElementById(attack);
            action.char = char;
            action.addEventListener("click", generateTargets)
        }
}

function generateTargets() {
    let targets = this.char.attackList[this.id].targets;
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
    let output = `<p>Select ${minTargets} target${(minTargets != 1) ? "s" : ""}`;
    // Create Checkboxes
    for (let enemy in game.enemyList) {
        output += `<input type="checkbox" value="${enemy}" id="${enemy}" class="menu">${enemy}</input>`
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
    listener.targets = char.attackList[attack].targets;
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
            const damageData = this.char.selectAttackTargets(this.attack, targets);
            playerTakeTurn(damageData,this.char);
        }
        // Invalid number of targets
        else {
            console.log("Incorrect Number");
        }
    }
    // No targets
    else {
        console.log("select a target");
    }
}


let currentUnit = 0;

function takeTurn() {
    generateHTML();
    enemyLives();

    let unit;
    selected = [];

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
            const damageData = enemy.selectAttackTargets(attack);
            console.log(damageData);
            // End turn if it doesn’t have enough AP
            if (damageData == 'not enough ap') {
                break;
            }
            else {
                // For each character that was targeted
                for (let char_name in damageData) {
                    // For each time the character was hit by the attack
                    for (let entry in damageData[char_name]) {
                        // Record if the attack was blocked, evaded, or taken
                        const baseDamage = damageData[char_name][entry].damage;
                        const target = game.characterList[char_name]
                        const takeData = target.takeDamage(baseDamage);
                        console.log(char_name, takeData);
                        // Change the aggro of the enemy towards the character
                        const char_status = target.state.status;
                        const aggroChange = damageData[char_name][entry].aggro;
                        enemy.changeAggro(char_name, aggroChange, char_status);
                    }
                }
            }
        }
        takeTurn();
    }
    else if (game.turnOrder[unit] == 'character') {
        console.log("CHARACTER_TURN: ", unit);
        // Character Turn (Needs Player Input) 
        const character = game.characterList[unit];
        character.startTurn();
        generateAttackMenu(character);
    }
    
}

function playerTakeTurn(damageData,char) {
    console.log(damageData);
    for (let enemy_name in damageData) {
        // For each time the enemy was hit by the attack
        for (let entry in damageData[enemy_name]) {
            // Record if the attack was blocked, evaded, or taken
            const baseDamage = damageData[enemy_name][entry].damage;
            const target = game.enemyList[enemy_name]
            const takeData = target.takeDamage(baseDamage);
            console.log(enemy_name, takeData);
            // Change the aggro of the enemy towards the character
            const aggroChange = 0 - damageData[enemy_name][entry].aggro;
            target.changeAggro(char, aggroChange, char.state.status);
        }
    }
    takeTurn()
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
    console.log(`${url}/test/table/characters`);
    const xhttp = new XMLHttpRequest();
    const xhttpEnemy = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/characters`);
    xhttp.onload = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                xhttpEnemy.open('GET', `${url}/test/table/enemys`);
                xhttpEnemy.onload = function () {
                    if (xhttpEnemy.readyState === 4) {
                        if (xhttpEnemy.status === 200) {
                            const characters = JSON.parse(xhttp.responseText);
                            const enemys = JSON.parse(xhttpEnemy.responseText);
                            // Initialize the game
                            generateGame(characters, enemys);
                            generateHTML();
                            document.getElementById("endTurnBtn").addEventListener("click",takeTurn);
                            // Start the game
                            takeTurn();
                        }
                    }
                }
                xhttpEnemy.send();
            }
        }
    }
    xhttp.send();

}