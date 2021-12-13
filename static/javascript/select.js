const url = "http://localhost:3000";
const staticUrl = "..";

function generateHTML(inData, enemyData) {
    let output = {
        display: "",
        form: ""
    };
    // Character data for database
    for (let entry in inData) {  
        let charImage = `${inData[entry].char_name} Sprite.png`;

        output.display += `<table id=${inData[entry].char_name} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${inData[entry].char_name} </th>\
            <tr><td align="center"><img src="${staticUrl}/images/${charImage}" alt="${inData[entry].char_name}" class="en" id="${inData[entry].char_name}" style="height: 80px; width: 60px; display: block; border-color: red; border-style: none"></td></tr>\
            <tr><td align="center">${inData[entry].description}</tr></td>\
            </table>`;

        output.form += `<label for="${inData[entry].char_name}">${inData[entry].char_name}:</label>\
                    <input type="checkbox" id="${inData[entry].char_name}" name="characters-${inData[entry].id_characters}" value="1">\
                    <br>`;
    }
    // Enemy data for database
    for (let entry in enemyData) {  
        let enemyImage = `${enemyData[entry].enemy_name} Sprite.png`;
        
        output.display += `<table id=${enemyData[entry].enemy_name} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${enemyData[entry].enemy_name} </th>\
            <tr><td align="center"><img src="${staticUrl}/images/${enemyImage}" alt="${enemyData[entry].enemy_name}" class="en" id="${enemyData[entry].enemy_name}" style="height: 80px; width: 60px; display: block; border-color: red; border-style: none"></td></tr>\
            <tr><td align="center">${enemyData[entry].description}</tr></td>\
            </table>`;

        output.form += `<label for="numberOfLesserEnemy">Enter number of ${enemyData[entry].enemy_name}: </label>\
        <input type="number" id="${enemyData[entry].enemy_name}" name="enemys-${enemyData[entry].id_enemys}" value="1" min="0" max="5" placeholder="Enter a number" required>\
        <br>`;
    }

    output.form += `<input type="submit" value="Start Game">`;

    return output;
}

window.onload = function () {
    console.log(`${url}/getNames/characters`);
    console.log(`${url}/getNames/enemys`)
    //console.log(`${url}/test/table/characters`);
    const xhttp = new XMLHttpRequest();
    const xhttpEnemys = new XMLHttpRequest();
    xhttp.open('GET', `${url}/getNames/characters`);
    //xhttp.open('GET', `${url}/test/table/characters`);
    xhttp.onload = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                xhttpEnemys.open('GET', `${url}/getNames/enemys`);
                xhttpEnemys.onload = function () {
                    if (xhttpEnemys.readyState === 4) {
                        if(xhttpEnemys.status === 200) {
                            const characters = JSON.parse(xhttp.responseText);
                            const enemys = JSON.parse(xhttpEnemys.responseText);
                            let html = generateHTML(characters, enemys);
                            console.log('in xhttp');
                            document.getElementById("container").innerHTML += html.display;
                            document.getElementById("select-form").innerHTML += html.form;
                        }
                    }
                }
                xhttpEnemys.send();
            }
        }
    }
    xhttp.send();
};