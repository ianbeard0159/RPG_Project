const url = "http://localhost:3000";

function generateHTML(inData) {
    let output = '';

    for (let entry in inData) {
        output += `<table id=${inData[entry]['support_name']} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th><a href="${url}/test/edit/supports/'id':${inData[entry]['id_supports']}">\
                ${inData[entry]['id_supports']}: ${inData[entry]['support_name']}\
            </th>`;
        for (let field in inData[entry]) {
            if (field != 'id_supports') {
                output += `<tr>\
                <td>${field}</td>\
                <td>${inData[entry][field]}</td>\
                </tr>`;
            }
        }
        output += `<tr><td><a href="${url}/test/delete/supports/${inData[entry]['id_supports']}">Delete support</a></td></tr>`;
        output += `</table>`;
    }

    return output;
}

window.onload = function () {
    console.log(`${url}/test/table/supports`);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/table/supports`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const supports = JSON.parse(xhttp.responseText);
                let html = generateHTML(supports);

                document.getElementById("link").innerHTML = `<a href="${url}/test/create/supports">Make New Support</a>\
                <br><a href="${url}/test">Test Landing Page</a>`;
                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};