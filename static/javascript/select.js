const url = "http://localhost:3000";

function generateHTML(inData) {
    let output = '';
    for (let entry in inData) {        
        output += `<table id=${entry} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${entry} </th>\
            <tr><td>${inData[entry].description}</tr></td>`;
    }
    return output;
}

window.onload = function () {
    console.log(`${url}/getNames/:unitTable`);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/getNames/:unitTable`);
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