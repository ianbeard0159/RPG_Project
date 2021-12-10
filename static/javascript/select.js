const url = "http://localhost:3000";

function generateHTML(inData, enemyData) {
    let output = '';
    // Character data for database
    for (let entry in inData) {  
        let charImage = "Jason Sprite.png"
        if(inData[entry].char_name == "Monica"){
            charImage = "Monica Sprite.png"
        }
        output += `<table id=${inData[entry].char_name} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${inData[entry].char_name} </th>\
            <tr><td align="center"><img src="../images/${charImage}" alt="${inData[entry].char_name}" class="en" id="${inData[entry].char_name}" style="height: 80px; width: 60px; display: block; border-color: red; border-style: none"></td></tr>\
            <tr><td align="center">${inData[entry].description}</tr></td>\
            </table>`;
    }
    // Enemy data for database
    for (let entry in enemyData) {  
        let enemyImage = "Lesser Demon Sprite.png"
        if(enemyData[entry].enemy_name == "Greater Demon"){
            enemyImage = "Greater Demon Sprite.png"
        }
        output += `<table id=${enemyData[entry].enemy_name} style="margin: 10px; padding: 5px; background-color: lightgray;">\
            <th>${enemyData[entry].enemy_name} </th>\
            <tr><td align="center"><img src="../images/${enemyImage}" alt="${enemyData[entry].enemy_name}" class="en" id="${enemyData[entry].enemy_name}" style="height: 80px; width: 60px; display: block; border-color: red; border-style: none"></td></tr>\
            <tr><td align="center">${enemyData[entry].description}</tr></td>\
            </table>`;
    }
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
                            document.getElementById("container").innerHTML += html;
                        }
                    }
                }
                xhttpEnemys.send();
            }
        }
    }
    xhttp.send();
};