const url = "http://localhost:3000";

import { GameClass } from './Classes/GameClass.js';
import { Character } from './Classes/subCharacter.js';
import { Enemy } from './Classes/subEnemy.js';
let characterList = {};
let enemyList = {};
let game = new GameClass();

function generateHTML(inData, enemyData) {
    let output = ''; 
    for (let entry in inData) {
        characterList[inData[entry].char_name] = new Character(
            inData[entry].description,
            inData[entry].strength,
            inData[entry].willpower,
            inData[entry].dexterity,
            inData[entry].focus, 
            inData[entry].defense,
            inData[entry].agility,
            inData[entry].char_level,
            inData[entry].health_ratio,
            inData[entry].essence_ratio,
            inData[entry].ap_ratio
            );

        // Make a request for the attacks used for that unit
        const xhttpAttacks = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpAttacks.open('GET', `${url}/getActions/characters/attacks/${inData[entry]['id_characters']}`, false);
        xhttpAttacks.onload = function () {
            // Parse the data from the response
            const attacks = JSON.parse(xhttpAttacks.responseText);
            // If there are any entries in the response
            for (let attack in attacks){
                // Make rows in the table for the attacks
                characterList[inData[entry].char_name].attackList[attacks[attack].attack_name] = attacks[attack];
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
                    for (let support in supports){
                        // Make rows in the table for the supports
                        characterList[inData[entry].char_name].supportList[supports[support].support_name] = supports[support];
                    }
                }
                xhttpSupports.send();
    }
    game.populateCharacters(characterList);

    for (let entry in enemyData) {
        enemyList[enemyData[entry].enemy_name] = new Enemy(
        enemyData[entry].description,
        enemyData[entry].strength,
        enemyData[entry].willpower,
        enemyData[entry].dexterity,
        enemyData[entry].focus, 
        enemyData[entry].defense,
        enemyData[entry].agility,
        enemyData[entry].char_level,
        enemyData[entry].health_ratio,
        enemyData[entry].ap_ratio
        );

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
                enemyList[enemyData[entry].enemy_name].attackList[attacks[attack].attack_name] = attacks[attack];
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
                        enemyList[enemyData[entry].enemy_name].supportList[supports[support].support_name] = supports[support];
                    }
                }
                xhttpSupports.send();
    }

    game.populateEnemys(enemyList);
    
    for (let char in game.characterList) {  
        output += `<table id=${char} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${char} </th>`;
        // Display all character fields
        for (let field in game.characterList[char]) {
            if (field != 'id_characters') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${game.characterList[char][field]}</td>\
                </tr>`;
            }
        }
        // Display character attacks and supports
        for (let attack in game.characterList[char].attackList){
            output += `<th>${attack} </th>\
            <tr><td>${game.characterList[char].attackList[attack].description}</tr></td>`;
        }
        for (let support in game.characterList[char].supportList){
            output += `<th>${support} </th>\
            <tr><td>${game.characterList[char].supportList[support].description}</tr></td>`;
        }
        output += '</table>';
    }

    // Display enemy information
    for (let enemy in game.enemyList) {   
        output += `<table id=${enemy} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${enemy} </th>\
            <tr><td>${game.enemyList[enemy].description}</tr></td>`;
        for (let attack in game.enemyList[enemy].attackList){
            output += `<th>${attack} </th>\
            <tr><td>${game.enemyList[enemy].attackList[attack].description}</tr></td>`;
        }
        for (let support in game.enemyList[enemy].supportList){
            output += `<th>${support} </th>\
            <tr><td>${game.enemyList[enemy].supportList[support].description}</tr></td>`;
        }
        output += `</table>`;
    }
    return output;
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
                        }
                    }
                }
                xhttpEnemy.send();
            }
        }
    }
    xhttp.send();

};