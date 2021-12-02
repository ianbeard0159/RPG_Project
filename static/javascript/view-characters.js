const url = "http://localhost:3000";

function generateHTML(inData) {
    let output = '';

    // For each entry in the original response, make a table for that entry
    for (let entry in inData) {
        output += `<table id=${inData[entry]['char_name']} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th><a href="${url}/test/edit/characters/'id':${inData[entry]['id_characters']}">\
                ${inData[entry]['id_characters']}: ${inData[entry]['char_name']}\
            </th>\
            <tr><td>-STATS-</tr></td>`;
        for (let field in inData[entry]) {
            if (field != 'id_characters') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${inData[entry][field]}</td>\
                </tr>`;
            }
        }
        // Make a second request for the attacks used for that unit
        const xhttpAttacks = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpAttacks.open('GET', `${url}/test/get-abilities/characters/attacks/${inData[entry]['id_characters']}`, false);
        xhttpAttacks.onload = function () {
            // Parse the data from the response
            const attacks = JSON.parse(xhttpAttacks.responseText);
            // If there are any entries in the response
            if(attacks[0]) {
                // Make rows in the table for the attacks
                output += "<tr><td>-ATTACKS-</td></tr>";
                for (let attack in attacks) {
                    console.log(attacks[attack]);
                    output += `<tr><td>${attacks[attack]["id_attacks"]}</td>\
                    <td>${attacks[attack]["attack_name"]}</td></tr>`;
                }
            }
        }
        xhttpAttacks.send();
        
        // Make a third request for the supports used for that unit
        const xhttpSupports = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpSupports.open('GET', `${url}/test/get-abilities/characters/supports/${inData[entry]['id_characters']}`, false);
        xhttpSupports.onload = function () {
            // Parse the data from the response
            const supports = JSON.parse(xhttpSupports.responseText);
            // If there are any entries in the response
            if(supports[0]) {
                // Make rows in the table for the supports
                output += "<tr><td>-SUPPORTS-</td></tr>";
                for (let support in supports) {
                    output += `<tr><td>${supports[support]["id_supports"]}</td>\
                    <td>${supports[support]["support_name"]}</td></tr>`;
                }
            }
        }
        xhttpSupports.send();

        output += `<tr><td><a href="${url}/test/delete/characters/${inData[entry]['id_characters']}">Delete Character</a></td></tr>`;
        output += `</table>`;
    }

    return output;
}

window.onload = function () {
    console.log(`${url}/test/table/characters`);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/characters`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const characters = JSON.parse(xhttp.responseText);
                let html = generateHTML(characters);

                document.getElementById("link").innerHTML = `<a href="${url}/test/create/characters">Make New Character</a>\
                <br><a href="${url}/test">Test Landing Page</a>`;
                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};