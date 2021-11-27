const url = "http://localhost:3000";

// Get all attacks from the <type>-attacks juction table
// where <type>_id = <id>
function getAttacks(type, id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/get-abilities/${type}/attacks/${id}`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const attacks = JSON.parse(xhttp.responseText);

                let html = "<p>-attacks</p>";

                for (let entry in attacks) {
                    for(let field in attacks[entry]) {
                        html += `<p>${attacks[entry]}: ${attacks[entry][field]}`;
                    }
                }

                document.getElementById("attacks").innerHTML += html;
            }
        }
    }
    xhttp.send();

}

// Get all supports from the <type>-supports juction table
// where <type>_id = <id>
function getSupports(type, id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/get-abilities/${type}/supports/${id}`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const supports = JSON.parse(xhttp.responseText);

                let html = "<p>-supports-</p>";

                for (let entry in supports) {
                    for(let field in supports[entry]) {
                        html += `<p>${supports[entry]}: ${supports[entry][field]}`;
                    }
                }

                document.getElementById("supports").innerHTML += html;
            }
        }
    }
    xhttp.send();

}


export function populateAbilities(type, id) {
    getAttacks(type, id);
    getSupports(type, id);

}