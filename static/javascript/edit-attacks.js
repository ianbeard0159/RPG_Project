const url = "http://localhost:3000";
import { parseData } from './parseURL.js';

function generateHTML(inData) {
    let output = `<form 
        action="/test/editResponse/attacks/${inData[0]['id_attacks']}" 
        method="post">`;

    output += `<label for="attack_name">Name</label>
        <br>
        <input type="text" id="attack_name" name="attack_name" value="${inData[0]['attack_name']}" />
        <br>
        
        <label for="description">Description</label>
        <br>
        <textarea id="description" name="description" rows="5" cols="30">${inData[0]['description']}</textarea>
        <br>
        
        <label for="attack_type">Attack type</label>
        <br>
        <input type="text" id="attack_type" name="attack_type" rows="5" cols="30">${inData[0]['attack_type']}</input>
        <br>
            
        <label for="ap_cost">AP Cost</label>
        <br>
        <input type="number" id="ap_cost" name="ap_cost"  value="${inData[0]['ap_cost']}"/>
        <br>
        
        <label for="essence_cost">Essence Cost</label>
        <br>
        <input type="number" id="essence_cost" name="essence_cost"  value="${inData[0]['essence_cost']}"/>
        <br>
        
        <label for="accuracy">Accuracy</label>
        <br>
        <input type="number" id="accuracy" name="accuracy"  value="${inData[0]['accuracy']}"/>
        <br>
        
        <label for="dammage_ratio">Dammage Ratio</label>
        <br>
        <input type="number" id="dammage_ratio" name="dammage_ratio"  value="${inData[0]['dammage_ratio']}"/>
        <br>
        
        <label for="crit_chance">Crit Chance</label>
        <br>
        <input type="number" id="crit_chance" name="crit_chance"  value="${inData[0]['crit_chance']}"/>
        <br>
        
        <label for="targets">Targets</label>
        <br>
        <input type="number" id="targets" name="targets"  value="${inData[0]['targets']}"/>
        <br>
        
        <label for="hits">Hits</label>
        <br>
        <input type="number" id="hits" name="hits"  value="${inData[0]['hits']}"/>
        <br>
        
        <label for="aggro_per_hit">Aggro per hit</label>
        <br>
        <input type="number" id="aggro_per_hit" name="aggro_per_hit"  value="${inData[0]['aggro_per_hit']}"/>
        <br>

        <br>
        <input type="submit" value="Submit">`;

    return output;
}

window.onload = function () {
    let inData = parseData(location.href);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/viewEntry/attacks/${inData.id}`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const attack = JSON.parse(xhttp.responseText);
                let html = generateHTML(attack);

                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};