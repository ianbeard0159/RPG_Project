const url = "http://localhost:3000";
import { parseData } from './parseURL.js';

function generateHTML(inData) {
    let output = `<form 
        action="/test/editResponse/characters/${inData[0]['id_character']}" 
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