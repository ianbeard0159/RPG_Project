
export function parseData(inString) {

    const data = inString.split("/").slice(-1)[0].split("-");
    let dataJSON = '{ '
    for (let entry in data) {
        if (entry != 0) dataJSON += ","
        dataJSON += data[entry].replace(/'/g, `"`);
    }
    dataJSON += ' }'
    return JSON.parse(dataJSON);
}
