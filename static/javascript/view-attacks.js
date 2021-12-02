const url = "http://localhost:3000";

function generateHTML(inData) {
    let output = '';

    for (let entry in inData) {
        output += `<table id=${inData[entry]['attack_name']} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th><a href="${url}/test/edit/attacks/'id':${inData[entry]['id_attacks']}">\
                ${inData[entry]['id_attacks']}: ${inData[entry]['attack_name']}\
            </th>`;
        for (let field in inData[entry]) {
            if (field != 'id_attacks') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${inData[entry][field]}</td>\
                </tr>`;
            }
        }
        output += `<tr><td><a href="${url}/test/delete/attacks/${inData[entry]['id_attacks']}">Delete attack</a></td></tr>`;
        output += `</table>`;
    }

    return output;
}

window.onload = function () {
    console.log(`${url}/test/table/attacks`);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/attacks`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const attacks = JSON.parse(xhttp.responseText);
                let html = generateHTML(attacks);

                document.getElementById("link").innerHTML = `<a href="${url}/test/create/attacks">Make New attack</a>\
                <br><a href="${url}/test">Test Landing Page</a>`;
                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};