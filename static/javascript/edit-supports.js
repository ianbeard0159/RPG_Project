const url = "http://localhost:3000";
import { parseData } from './parseURL.js';

function generateHTML(inData) {
    let output = `<form 
        action="/test/editResponse/supports/${inData[0]['id_supports']}" 
        method="post">`;

    output += `<label for="support_name">Name</label>
        <br>
        <input type="text" id="support_name" name="support_name" value="${inData[0]['support_name']}" />
        <br>
        
        <label for="description">Description</label>
        <br>
        <textarea id="description" name="description" rows="5" cols="30">${inData[0]['description']}</textarea>
        <br>
            
        <label for="support_type">AP Cost</label>
        <br>
        <input type="text" id="support_type" name="support_type"  value="${inData[0]['support_type']}"/>
        <br>
            
        <label for="ap_cost">AP Cost</label>
        <br>
        <input type="number" id="ap_cost" name="ap_cost"  value="${inData[0]['ap_cost']}"/>
        <br>
        
        <label for="essence_cost">Essence Cost</label>
        <br>
        <input type="number" id="essence_cost" name="essence_cost"  value="${inData[0]['essence_cost']}"/>
        <br>
        
        <label for="base_heal">base_heal</label>
        <br>
        <input type="number" id="base_heal" name="base_heal"  value="${inData[0]['base_heal']}"/>
        <br>
        
        <label for="targets">Targets</label>
        <br>
        <input type="number" id="targets" name="targets"  value="${inData[0]['targets']}"/>
        <br>

        <label for="revive">Revive?</label>
        <br>
        <input type="radio" id="true" name="revive" value="1" ${inData[0]['revive'] == 1 ? 'checked' : ''}/>
        <label for="true" >True</label>
        <input type="radio" id="false" name="revive" value="0"  ${inData[0]['revive'] == 0 ? 'checked' : ''}/>
        <label for="false" >False</label>
        <br>

        <label for="revive">Modifier?</label>
        <br>
        <input type="radio" id="true" name="modifier" value="1"  ${inData[0]['modifier'] == 1 ? 'checked' : ''}/>
        <label for="true" >True</label>
        <input type="radio" id="false" name="modifier" value="0"  ${inData[0]['modifier'] == 0 ? 'checked' : ''}/>
        <label for="false" >False</label>
        <br>
        
        <label for="aggro">Aggro per hit</label>
        <br>
        <input type="number" id="aggro" name="aggro"  value="${inData[0]['aggro']}"/>
        <br>

        <br>
        <input type="submit" value="Submit">`;

    return output;
}

window.onload = function () {
    let inData = parseData(location.href);
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', `${url}/test/viewEntry/supports/${inData.id}`);
    xhttp.onload = function () {
        if(xhttp.readyState === 4) {
            if(xhttp.status === 200) {
                const support = JSON.parse(xhttp.responseText);
                let html = generateHTML(support);

                document.getElementById("container").innerHTML += html;
            }
        }
    }
    xhttp.send();

};