// Setup dropdown
function setupDropDown(){
    Object.keys(items).forEach(k => {
        var itemSelector = document.getElementById("itemType");
        var option = document.createElement("option");
        option.text = k;
        option.value = k;
        itemSelector.add(option);
    });
}

function findMaxedLines(selectedLines){
    // Init maxedLinesCounter with 0 for each group - avoids undefined
    var maxedLinesCounter = {
        "Boss": 0,
        "IED": 0,
        "Drop": 0,
        "Ignore Damage": 0,
        "Invincible Change": 0,
        "Skill Increase": 0,
        "Invincible Time": 0
    }
    selectedLines.forEach(l => {
        if(l in Object.keys(limitedLines)){
            var group = limitedLines[l];
            maxedLinesCounter[group]++;
        }
    });
    return maxedLinesCounter;
}

function expandDictionary(options, selectedLines){
    // TODO: build list of line groups that already hit max
    var maxedLinesCounter = findMaxedLines(selectedLines);
    var list = [];
    // Build list of <weight> number of cases of each potential line
    Object.keys(options).forEach( k => {
        // If k is in limitedLines and limitedLines[k] is in maxedLinesCounter, do not add to list
        if(k in Object.keys(limitedLines)){
            var group = limitedLines[k];
            if(limitedLineGroup[group] <= maxedLinesCounter[group]){
                return;
            }
        }
        for(let i = 0; i < options[k]; i++){
            list.push(k);
        }
    });
    return list;
}

function selectLine(options, selectedLines){
    var expandedList = expandDictionary(options, selectedLines);
    var index = Math.floor(Math.random() * expandedList.length);
    return expandedList[index];
}

function generateLines(){
    var itemType = document.getElementById("itemType").value;
    var lineOptions = items[itemType];
    var selectedLines = [];
    for(let i = 0; i < 6; i++){
        if(i === 0){
            // Prime first line
            selectedLines.push(selectLine(lineOptions["prime"], selectedLines));
        }else if (i === 1 || i === 4){
            // 10% of prime line
            var primeLine = Math.floor(Math.random() * 100) < 10;
            if(primeLine){
                selectedLines.push(selectLine(lineOptions["prime"], selectedLines));
            }else{
                selectedLines.push(selectLine(lineOptions["secondary"], selectedLines));
            }
        }else{
            // 1% of prime line
            var primeLine = Math.floor(Math.random() * 100) < 1;
            if(primeLine){
                selectedLines.push(selectLine(lineOptions["prime"], selectedLines));
            }else{
                selectedLines.push(selectLine(lineOptions["secondary"], selectedLines));
            }
        }
    }
    var output = selectedLines.reduce((accumulator, value) => {
        return accumulator + `<div>${value}</div>`;
    });
    var lineOutput = document.getElementById("lines");
    lineOutput.innerHTML = output;
}