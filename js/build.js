const DOC_ID = '1fiBZAlaI0IdFowVskG8xnDf2EVhYenDI4OzLDBOezWo';
const API_KEY = 'AIzaSyCThqYkMtdcnXVKLCJHMpFYYBSNfg4_Ve4';

function getSheets() {
    let api = 'https://sheets.googleapis.com/v4/spreadsheets/' + DOC_ID + '?key=' + API_KEY;

    return fetch(api)
        .then(response => response.json())
        .then(json => json.sheets.map((sheet, index) => getSheet(sheet.properties.title, index)))
        .then(document.querySelector(`main`).style.display = "block")
        .catch(error => console.log('Error loading sheets: ' + error));
}

function getSheet(sheetName, index) {
    let api = 'https://sheets.googleapis.com/v4/spreadsheets/' + DOC_ID + '/values/' + sheetName + '!A1:B15?key=' + API_KEY;

    return fetch(api)
        .then(response => response.json())
        .then(json => {
            json.values.unshift(['index', index]);
            return json.values.reduce((o, [k, v]) => (o[k] = v, o), {})
        })
        .catch(error => console.log('Error loading sheet ' + sheetName + ': ' + error));
}

function renderSheet(item, index, sheets) {
    item.then(s => {
        renderSheetData(s, index);
    })
}

function renderSheets() {
    getSheets().then(
        s => {
            s.forEach(renderSheet);
        }
    )
}

function renderSheetData(sheetData, sheetIndex) {
    for (var key in sheetData) {
        if (!sheetData.hasOwnProperty(key) || key === 'index') {
            continue;
        }
        var value = sheetData[key];
        if (value === undefined) {
            continue
        }

        if (key.endsWith('-link')) {
            document.querySelector(`.sheet-${sheetIndex + 1} [data-src='${key}']`).setAttribute('href', value);
        }
        else if (key.endsWith('-image')) {
            document.querySelector(`.sheet-${sheetIndex + 1} [data-src='${key}']`).setAttribute('src', value);
        }
        else if (key.endsWith('-source')) {
            document.querySelector(`.sheet-${sheetIndex + 1} [data-src='${key}']`).setAttribute('src', value);
        }
        else {
            document.querySelector(`.sheet-${sheetIndex + 1} [data-src='${key}']`).innerHTML = value;
        }
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    renderSheets();
});
