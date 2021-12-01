const url = "http://localhost:3000";
const Character = require ('./Classes/subCharacter');
//import { Character } from "./Classes/subCharacter";
const characterArray = [];

function generateHTML(inData) {
    for (let entry in inData) {
        let char = {};
        char = new Character(0,0,inData[entry]['strength'],inData[entry]['willpower'],inData[entry]['dexterity'],inData[entry]['focus'], inData[entry]['defense'],inData[entry]['agility'],inData[entry]['char_level'],inData[entry]['health_ratio'],inData[entry]['ap_ratio'])
        characterArray.push(char)
        console.log(characterArray)
    } 
}


window.onload = function () {
    console.log(`${url}/test/table/characters`);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/characters`);
    xhttp.onload = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                const characters = JSON.parse(xhttp.responseText);
                let html = generateHTML(characters);
                console.log('in xhttp');
                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};