const url = "http://localhost:3000";

function generateHTML(inData) {
    let output = '';

    // For each entry in the original response, make a table for that entry
    for (let entry in inData) {
        output += `<table id=${inData[entry]['enemy_name']} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th><a href="${url}/test/edit/enemys/'id':${inData[entry]['id_enemys']}">\
                ${inData[entry]['id_enemys']}: ${inData[entry]['enemy_name']}\
            </th>\
            <tr><td>-STATS-</tr></td>`;
        for (let field in inData[entry]) {
            if (field != 'id_enemys') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${inData[entry][field]}</td>\
                </tr>`;
            }
        }
        // Make a second request for the attacks used for that unit
        const xhttpAttacks = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpAttacks.open('GET', `${url}/test/get-abilities/enemys/attacks/${inData[entry]['id_enemys']}`, false);
        xhttpAttacks.onload = function () {
            // Parse the data from the response
            const attacks = JSON.parse(xhttpAttacks.responseText);
            // If there are any entries in the response
            if(attacks[0]) {
                // Make rows in the table for the attacks
                output += "<tr><td>-ATTACKS-</td></tr>";
                for (let attack in attacks) {
                    output += `<tr><td>${attacks[attack]["id_attacks"]}</td>\
                    <td>${attacks[attack]["attack_name"]}</td></tr>`;
                }
            }
        }
        xhttpAttacks.send();
        
        // Make a third request for the supports used for that unit
        const xhttpSupports = new XMLHttpRequest();
        // Make sure the response is syncronous
        xhttpSupports.open('GET', `${url}/test/get-abilities/enemys/supports/${inData[entry]['id_enemys']}`, false);
        xhttpSupports.onload = function () {
            // Parse the data from the response
            const supports = JSON.parse(xhttpSupports.responseText);
            // If there are any entries in the response
            if(supports[0]) {
                // Make rows in the table for the supports
                output += "<tr><td>-SUPPORTS-</td></tr>";
                for (let support in supports) {
                    console.log(supports[support]);
                    output += `<tr><td>${supports[support]["id_supports"]}</td>\
                    <td>${supports[support]["support_name"]}</td></tr>`;
                }
            }
        }
        xhttpSupports.send();

        output += `<tr><td><a href="${url}/test/delete/enemys/${inData[entry]['id_enemys']}">Delete enemy</a></td></tr>`;
        output += `</table>`;
    }

    return output;
}

window.onload = function () {
    console.log(`${url}/test/table/enemys`);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/enemys`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const enemys = JSON.parse(xhttp.responseText);
                let html = generateHTML(enemys);

                document.getElementById("link").innerHTML = `<a href="${url}/test/create/enemys">Make New enemy</a>\
                <br><a href="${url}/test">Test Landing Page</a>`;
                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};