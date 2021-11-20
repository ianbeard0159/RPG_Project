const url = "http://localhost:3000";

function generateHTML(inData) {
    let output = '';

    for (let entry in inData) {
        output += `<table id=${inData[entry]['char_name']}>\
            <th>${inData[entry]['id_character']}: ${inData[entry]['char_name']}</th>`;
        for (let field in inData[entry]) {
            if (field != 'id_character') output += `<tr>\
                <td>${field}</td>\
                <td>${inData[entry][field]}</td>\
            </tr>`;
        }
        output += `</table>`;
    }

    return output;
}

window.onload = function () {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/characters`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const characters = JSON.parse(xhttp.responseText);
                let html = generateHTML(characters);

                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};