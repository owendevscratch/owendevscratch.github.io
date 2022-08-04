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
        if(l in limitedLines){
            var group = limitedLines[l];
            maxedLinesCounter[group]++;
        }
    });
    return maxedLinesCounter;
}

function selectLine(options, selectedLines){
    var maxedLinesCounter = findMaxedLines(selectedLines);
    // Get max number to generate
    var max = 0;
    var skipList = [];
    Object.keys(options).forEach(k => {
        if(k in limitedLines){
            var group = limitedLines[k];
            if(limitedLineGroup[group] <= maxedLinesCounter[group]){
                skipList.push(k);
                return;
            }
        }
        max = max + options[k];
    });
    // This is bad to read
    var randResult = Math.random() * max;
    var sum = 0;
    var selectedLine = '';
    var found = false;
    // Find line by weight where random number is <= sum of all lines up to that point (excluding already maxed lines)
    Object.keys(options).forEach(k => {
        if(found){
            return;
        }
        if(k in skipList){
            return;
        }
        // Default in case of rounding error
        if(selectedLine === ''){
            selectedLine = k;
        }
        sum += options[k];
        if(randResult <= sum){
            found = true;
            selectedLine = k;
            return;
        };
    });
    // Sanity check for 
    return selectedLine;
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

    var counter = document.getElementById("counter");
    var count = parseInt(counter.textContent);
    counter.textContent = count + 1;
}

var lineIndex = -1;

var lines = [];

function pickLine(){
    var counter = document.getElementById("counter");
    var count = parseInt(counter.textContent);
    counter.textContent = count + 1;

    lineIndex = Math.floor(Math.random() * 3);

    var output = '';
    for(var i = 0; i < lines.length; i++){
        if(i !== lineIndex){
            output = output + `<div>${lines[i]}</div>`;
        }else{
            
            output = output + `<div>*${lines[i]}*</div>`;
        }
    }

    var lineOutput = document.getElementById("lines");
    lineOutput.innerHTML = output;
    
    var roll = document.getElementById("roll");
    roll.removeAttribute("disabled");
}

function rollLine(){
    var itemType = document.getElementById("itemType").value;
    var lineOptions = items[itemType];
    var primeLine = Math.floor(Math.random() * 100) < 15;
    var selectedLines = [];
    for(var i = 0; i < lines.length; i++){
        if(i !== lineIndex){
            selectedLines.push(lines[i]);
        }
    }

    if(primeLine){
        lines[lineIndex] = selectLine(lineOptions["prime"], selectedLines);
    }else{
        lines[lineIndex] = selectLine(lineOptions["secondary"], selectedLines);
    }

    var output = lines.reduce((accumulator, value) => {
        return accumulator + `<div>${value}</div>`;
    });
    var lineOutput = document.getElementById("lines");
    lineOutput.innerHTML = output;

    var roll = document.getElementById("roll");
    roll.setAttribute("disabled", true);
}

function setupLines(){
    var itemType = document.getElementById("itemType").value;
    var lineOptions = items[itemType];
    setupLineDropDowns(lineOptions);
    var selectedLines = [];
    for(let i = 0; i < 3; i++){
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

    lines = selectedLines;
    var roll = document.getElementById("roll");
    roll.setAttribute("disabled", true);
}

function setupLineDropDowns(options){
    var dropdowns = document.getElementsByClassName("lineSelector");
    for(var i = 0; i < dropdowns.length; i++){
        dropdowns[i].innerHTML = '';
    }
    Object.keys(options["prime"]).forEach(k => {
        for(var i = 0; i < dropdowns.length; i++){
            var option = document.createElement("option");
            option.text = k;
            option.value = k;
            dropdowns[i].add(option);
        }
    });
    Object.keys(options["secondary"]).forEach(k => {
        for(var i = 0; i < dropdowns.length; i++){
            var option = document.createElement("option");
            option.text = k;
            option.value = k;
            dropdowns[i].add(option);
        }
    });
}

function manualSetLines(){
    var dropdown1 = document.getElementById("line1");
    var dropdown2 = document.getElementById("line2");
    var dropdown3 = document.getElementById("line3");
    lines = [dropdown1.value, dropdown2.value, dropdown3.value]

    var output = lines.reduce((accumulator, value) => {
        return accumulator + `<div>${value}</div>`;
    });
    var lineOutput = document.getElementById("lines");
    lineOutput.innerHTML = output;

    var roll = document.getElementById("roll");
    roll.setAttribute("disabled", true);
}

function setupDropDownAndLines(){
    setupDropDown();
    setupLines();
}