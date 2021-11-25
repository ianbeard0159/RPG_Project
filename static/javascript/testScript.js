const url = "http://localhost:3000";

function generateHTML(inData) {
    let output = '';

    for (let entry in inData) {
        output += `<table id=${inData[entry]['char_name']} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th><a href="${url}/test/edit/character/'id':${inData[entry]['id_character']}">\
                ${inData[entry]['id_character']}: ${inData[entry]['char_name']}\
            </th>`;
        for (let field in inData[entry]) {
            if (field != 'id_character') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${inData[entry][field]}</td>\
                </tr>`;
            }
        }
        output += `<tr><td><a href="${url}/test/delete/characters/${inData[entry]['id_character']}">Delete Character</a></td></tr>`;
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

                document.getElementById("link").innerHTML = `<a href="${url}/test/testCharacterEntry">Make New Character</a>`;
                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};