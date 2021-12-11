const url = "http://localhost:3000";


import { GameClass } from './Classes/GameClass.js';
import { Action } from './Classes/supAction.js';
let game = new GameClass();
let selected = [];


function generateHTML() {
    let output = '';
    for (let char in game.characterList) {
        output += `<div><img src="../images/${char} Sprite.png" class="sprite" id="${char}">
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
        output += `<th> -ATTACKS- </th>`;
        for (let attack in game.characterList[char].attackList) {
            output += `<tr><td><strong>${attack} </strong></td></tr>\
            <tr><td>${game.characterList[char].attackList[attack].description}</tr></td>`;
        }
        output += `<th> -SUPPORTS- </th>`;
        for (let support in game.characterList[char].supportList) {
            output += `<tr><td><strong>${support} </strong></td></tr>\
            <tr><td>${game.characterList[char].supportList[support].description}</tr></td>`;
        }

        output += '</table> </div>';
    }

    //dramatic spacing
    output += '<div class="spacing"> </div>'

    // Enemy table generation

    for (let enemy in game.enemyList) {
        output += `<div><img src="../images/${enemy} Sprite.png" class="sprite"> 
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

        // Display enemy attack and support
        output += `<th> -ATTACKS- </th>`;
        for (let attack in game.enemyList[enemy].attackList) {
            output += `<tr><td><strong>${attack} </strong></td></tr>\
            <tr><td>${game.enemyList[enemy].attackList[attack].description}</tr></td>`;
        }
        output += `<th> -SUPPORTS- </th>`;
        for (let support in game.enemyList[enemy].supportList) {
            output += `<tr><td><strong>${support} </strong></td></tr>\
            <tr><td>${game.enemyList[enemy].supportList[support].description}</tr></td>`;
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

    let characterList = {};
    for (let entry in inData) {
        characterList[inData[entry].char_name] = inData[entry];
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

    let enemyList = {};
    for (let entry in enemyData) {
        enemyList[enemyData[entry].enemy_name] = enemyData[entry];
    }
    game.populateEnemys(enemyList);
    game.populateGame();
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
            console.log(attack)
            let action =  document.getElementById(attack);
            action.char = char;
            action.addEventListener("click", generateTargets)
        }
}

function generateTargets() {
    let output = '';
    for (let enemy in game.enemyList) {
        output += `<input type=submit value="${enemy}" id="${enemy}" class="menu"></input>`
        document.getElementById("menu").innerHTML += output
    }
    document.getElementById("menu").innerHTML = output;
    generateTargetListeners(this.id, this.char);
}

function generateTargetListeners(attack,char) {
    for (let enemy in game.enemyList) {
        let listener = document.getElementById(enemy);
        listener.attack = attack;
        listener.char = char;
        listener.addEventListener("click", executeAttack);
    }
}

function executeAttack() {
    console.log(this.id)
    console.log(this.attack)
    console.log(this.char)
    addTarget(this.id);
    const damageData = this.char.selectAttackTargets(this.attack, selected);
    playerTakeTurn(damageData,this.char);
}

function addTarget(enemy) {

    let target = {
        char_name: enemy,
        char_def: game.enemyList[enemy].def,
        char_agi: game.enemyList[enemy].agi,
        char_tension: game.enemyList[enemy].tension
    };
    selected.push(target);
}

function takeTurn() {
    generateHTML();
    enemyLives();
    console.log("in main game");
    console.log(game);
    for (let unit in game.turnOrder) {

        console.log("enemy turn")
        if (game.turnOrder[unit] == 'enemy') {
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
                // End turn if it doesn’t have enough AP
                if (damageData != 'not enough ap') {
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
                            // Change the aggro of the enemy towards the character
                            const char_status = target.state.status;
                            const aggroChange = damageData[char_name][entry].aggro;
                            enemy.changeAggro(char_name, aggroChange, char_status);
                        }
                    }
                }
            }
            takeTurn();
            break;
        }
        else if (game.turnOrder[unit] == 'character') {
            console.log("character turn")
            // Character Turn (Needs Player Input) 
            const character = game.characterList[unit];
            character.startTurn();
            generateAttackMenu(character)
            break;
        }
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
            console.log(takeData);
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
        console.log(enemy)
        if (game.enemyList[enemy].HP_current != 0) {
            thisGame = true;
            allEnemy = false;
        }
    }
    for (let char in game.characterList) {
        if (game.characterList[char].HP_current != 0) {
            console.log(char)
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
                            generateGame(characters, enemys)
                            generateHTML();
                            document.getElementById("endTurnBtn").addEventListener("click",takeTurn);
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