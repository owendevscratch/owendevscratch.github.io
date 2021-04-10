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

function selectLine(options){
    // TODO: Use weights in random selection
    var index = Math.floor(Math.random() * Object.keys(options).length);
    return Object.keys(options)[index];
}

function generateLines(){
    // TODO: Certain items cannot have special line combinations (ie: only max 2L boss on wse)
    var itemType = document.getElementById("itemType").value;
    var lineOptions = items[itemType];
    var lines = "";
    for(let i = 0; i < 6; i++){
        if(i === 0){
            // Prime first line
                lines += `<div>${selectLine(lineOptions["prime"])}</div>`;
        }else if (i === 2 || i === 4){
            // 10% of prime line
            var primeLine = Math.floor(Math.random() * 100) < 10;
            if(primeLine){
                lines += `<div>${selectLine(lineOptions["prime"])}</div>`;
            }else{
                lines += `<div>${selectLine(lineOptions["secondary"])}</div>`;
            }
        }else{
            // 1% of prime line
            var primeLine = Math.floor(Math.random() * 100) < 1;
            if(primeLine){
                lines += `<div>${selectLine(lineOptions["prime"])}</div>`;
            }else{
                lines += `<div>${selectLine(lineOptions["secondary"])}</div>`;
            }
        }
        lines += "\n";
    }
    var lineOutput = document.getElementById("lines");
    lineOutput.innerHTML = lines;
}