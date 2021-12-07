const url = "http://localhost:3000";

import { GameClass } from './Classes/GameClass.js';
let game = new GameClass();
let selected = [];

function generateHTML(inData, enemyData) {
    let output = ''; 
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
            for (let attack in attacks){
                // Make rows in the table for the attacks
                inData[entry].attackList[attacks[attack].attack_name] = attacks[attack];
                console.log(attacks[attack]);
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
            for (let support in supports){
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
            for (let attack in attacks){
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
                    for (let support in supports){
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
    
    for (let char in game.characterList) {  
        output += `<table id=${char} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${char} </th>`;
        // Display all character fields
        for (let field in game.characterList[char]) {
            if (field != 'id_characters' && field != 'attackList' && field != 'supportList') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${game.characterList[char][field]}</td>\
                </tr>`;
            }
        }
        // Display character attacks and supports
        output += `<th> -ATTACKS- </th>`;
        for (let attack in game.characterList[char].attackList){
            output += `<tr><td><strong>${attack} </strong></td></tr>\
            <tr><td>${game.characterList[char].attackList[attack].description}</tr></td>`;
        }
        output += `<th> -SUPPORTS- </th>`;
        for (let support in game.characterList[char].supportList){
            output += `<tr><td><strong>${support} </strong></td></tr>\
            <tr><td>${game.characterList[char].supportList[support].description}</tr></td>`;
        }
        
        output += '</table>';
    }

    // Enemy table generation

    for (let enemy in game.enemyList) {
        output += `<img src="../images/Jason8.png" class="en" id="${enemy}" style="height: 80px; width: 60px; display: block; border-color: red; border-style: none"> 
        <table id=${enemy}tab  style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${enemy} </th>`;
        // Display all enemy fields
        for (let field in game.enemyList[enemy]) {
            if (field != 'id_enemys' && field != 'attackList' && field != 'supportList') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${game.enemyList[enemy][field]}</td>\
                </tr>`;
            }
        }

        // Display enemy attack and support
        output += `<th> -ATTACKS- </th>`;
        for (let attack in game.enemyList[enemy].attackList){
            output += `<tr><td><strong>${attack} </strong></td></tr>\
            <tr><td>${game.enemyList[enemy].attackList[attack].description}</tr></td>`;
        }
        output += `<th> -SUPPORTS- </th>`;
        for (let support in game.enemyList[enemy].supportList){
            output += `<tr><td><strong>${support} </strong></td></tr>\
            <tr><td>${game.enemyList[enemy].supportList[support].description}</tr></td>`;
        }
        output += `</table>`;
    }
    console.log(game.enemyList);
    return output;
}
function generateListeners(){
    // onClick listeners for the images of enemies
    for (let enemy in game.enemyList) {
    document.getElementById(enemy).addEventListener("click", () => giveId(enemy),false);
    }

    //listens for the basic buttons
    document.getElementById("attackbtn").addEventListener("click", () => attack(),false);
}

function attack(){
    
    for (let enemy in game.enemyList) {
        document.getElementById(enemy).style.border = "solid red";
        }
    if(selected != []){
        let attackData = game.characterList["Jason"].selectAttackTargets('Basic Attack', selected);
        for (let enemy in selected) {
            console.log(game.enemyList["Lesser Demon"].HP_current);
            let some = game.enemyList["Lesser Demon"].takeDamage(attackData['Lesser Demon'][0].damage);
            console.log(game.enemyList["Lesser Demon"].HP_current);
            console.log(some);
        }
        console.log(attackData);
        selected = [];
        for (let enemy in game.enemyList) {
            document.getElementById(enemy).style.border = "none";
            }
    }
}

function giveId(enemy) {
    console.log(`id is ${enemy}`)
    let target = {char_name: enemy,
                char_def: game.enemyList[enemy].def,
                char_agi: game.enemyList[enemy].agi,
                char_tension: game.enemyList[enemy].tension};
    selected.push(target);
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
                            let html = generateHTML(characters, enemys);
                            document.getElementById("container").innerHTML += html;
                            document.getElementById("container").addEventListener('load', generateListeners());     
                        }
                    }
                }
                xhttpEnemy.send();
            }
        }
    }
    xhttp.send();

};