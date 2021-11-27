const url = "http://localhost:3000";
import { parseData } from './parseURL.js';

function generateTextBox (id, name, type, check) {
    let output = '';
    if (check) output += `<input type="checkbox" id="${type}-${id}" name="${type}-${id}" value="id_${type} = '${id}'" checked>`;
    else output += `<input type="checkbox" id="${type}-${id}" name="${type}-${id}" value="id_${type} = '${id}'">`;
    output += `<label for="${type}-${id}">${id}: ${name}</label><br>`;
    return output;
}

function generateHTML(inData) {
    let output = `<form 
        action="/test/editResponse/characters/${inData[0]['id_characters']}" 
        method="post">`;

    output += `<label for="char_name">Name</label>
        <br>
        <input type="text" id="char_name" name="char_name" value="${inData[0]['char_name']}" />
        <br>
        
        <label for="description">Description</label>
        <br>
        <textarea id="description" name="description" rows="5" cols="30">${inData[0]['description']}</textarea>
        <br>`;

    for (let field in inData[0]) {
        if (field != "character_id" && field != "char_name" && field != "description") {
            output += `<label for="${field}">${field}</label>
                <br>
                <input type="text" id="${field}" name="${field}" value="${inData[0][field]}" />
                <br>`;
        }
    }
    // Get abilities

    // Make a second request for the attacks used for that unit
    const xhttpAttacks = new XMLHttpRequest();
    // Make sure the response is syncronous
    xhttpAttacks.open('GET', `${url}/test/get-abilities/attacks`, false);
    xhttpAttacks.onload = function () {
        let charAttacks;

        // Get all of the attacks that the character has.
        const xhttpCharAttacks = new XMLHttpRequest();
        xhttpCharAttacks.open('GET', `${url}/test/get-abilities/characters/attacks/${inData[0]['id_characters']}`, false);
        xhttpCharAttacks.onload = function () {
            // Store a list of the character's attacks
            charAttacks = JSON.parse(xhttpCharAttacks.responseText);
        }
        xhttpCharAttacks.send();

        // Parse the data from the response
        const attacks = JSON.parse(xhttpAttacks.responseText);
        // If there are any entries in the response
        if(attacks[0]) {
            // Make rows in the table for the attacks
            output += "<p>-ATTACKS-</p>";
            for (let attack in attacks) {
                if (charAttacks[attack]) {
                    if (charAttacks[attack]["id_attacks"] == attacks[attack]["id_attacks"]) {
                        output += generateTextBox(attacks[attack]["id_attacks"], attacks[attack]["attack_name"], "attacks", true);
                    }
                    else {
                        output += generateTextBox(attacks[attack]["id_attacks"], attacks[attack]["attack_name"], "attacks", false);
                    }
                }
                else {
                    output += generateTextBox(attacks[attack]["id_attacks"], attacks[attack]["attack_name"], "attacks", false);
                }
            }
        }
    }
    xhttpAttacks.send();
    
    // Make a third request for the supports used for that unit
    const xhttpSupports = new XMLHttpRequest();
    // Make sure the response is syncronous
    xhttpSupports.open('GET', `${url}/test/get-abilities/supports`, false);
    xhttpSupports.onload = function () {
        let charsupports;

        // Get all of the supports that the character has.
        const xhttpCharSupports = new XMLHttpRequest();
        xhttpCharSupports.open('GET', `${url}/test/get-abilities/characters/supports/${inData[0]['id_characters']}`, false);
        xhttpCharSupports.onload = function () {
            // Store a list of the character's supports
            charsupports = JSON.parse(xhttpCharSupports.responseText);
        }
        xhttpCharSupports.send();

        // Parse the data from the response
        const supports = JSON.parse(xhttpSupports.responseText);
        // If there are any entries in the response
        if(supports[0]) {
            // Make rows in the table for the supports
            output += "<p>-SUPPORTS-</p>";
            for (let support in supports) {
                if (charsupports[support]) {
                    if (charsupports[support]["id_supports"] == supports[support]["id_supports"]) {
                        output += generateTextBox(supports[support]["id_supports"], supports[support]["support_name"], "supports", true);
                    }
                    else {
                        output += generateTextBox(supports[support]["id_supports"], supports[support]["support_name"], "supports", false);
                    }
                }
                else {
                    output += generateTextBox(supports[support]["id_supports"], supports[support]["support_name"], "supports", false);
                }
            }
        }
    }
    xhttpSupports.send();

    output += `<br>
        <input type="submit" value="Submit"></form>`;

    return output;
}

window.onload = function () {
    let inData = parseData(location.href);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/viewEntry/characters/${inData.id}`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const character = JSON.parse(xhttp.responseText);
                let html = generateHTML(character);

                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};