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
            inData[entry].ap_ratio
            );
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
    }

    game.populateEnemys(enemyList);
    
    for (let char in game.characterList) {  
        output += `<table id=${char} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${char} </th>\
            <tr><td>${game.characterList[char].description}</tr></td></table>`;
    }
    for (let enemy in game.enemyList) {   
        output += `<table id=${enemy} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${enemy} </th>\
            <tr><td>${game.enemyList[enemy].description}</tr></td></table>`;
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