const url = "http://localhost:3000";

import { GameClass } from './Classes/GameClass.js';
import { Character } from './Classes/subCharacter.js';
import { Enemy } from './Classes/subEnemy.js';
const characterArray = [];
const EnemyArray = [];
let game = new GameClass();

function generateHTML(inData, enemyData) {
    let output = ''; 
    for (let entry in inData) {
        let char = {};
        char = new Character(inData[entry]['char_name'],inData[entry]['description'],
                            inData[entry]['strength'],inData[entry]['willpower'],
                            inData[entry]['dexterity'],inData[entry]['focus'], 
                            inData[entry]['defense'],inData[entry]['agility'],
                            inData[entry]['char_level'],inData[entry]['health_ratio'],
                            inData[entry]['ap_ratio']);
        characterArray.push(char)
    }
    console.log(inData);
    console.log(characterArray)
    game.populateCharacters(characterArray);
    console.log(game);

    for (let entry in enemyData) {
        let char = {};
        char = new Enemy(enemyData[entry]['char_name'], enemyData[entry]['description'], 
                         enemyData[entry]['strength'], enemyData[entry]['willpower'],
                         enemyData[entry]['dexterity'], enemyData[entry]['focus'], 
                         enemyData[entry]['defense'],enemyData[entry]['agility'],
                         enemyData[entry]['char_level'],enemyData[entry]['health_ratio'],
                         enemyData[entry]['ap_ratio']);
        characterArray.push(char)
    }

    console.log(enemies);
    game.populateEnemys(enemyArray);
    console.log(game);
    
    for (let char in characterArray) {   
        output += `<table id=${characterArray[char].char_name} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${characterArray[char].char_name} </th>\
            <tr><td>${characterArray[char].char_desc}</tr></td>`;
    }
    return output;
}


window.onload = function () {
    console.log(`${url}/test/table/characters`);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/characters`);
    xhttp.onload = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                const characters = JSON.parse(xhttp.responseText);
                const enemys = JSON.parse(xhttp.responseText);
                let html = generateHTML(characters, enemys);
                console.log('in xhttp');
                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};