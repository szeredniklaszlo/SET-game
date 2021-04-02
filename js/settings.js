let numOfPlayers = document.querySelector("#numOfPlayers");
numOfPlayers.addEventListener("input", onInputNumOfPlayers);

let nameOfPlayersDiv = document.querySelector("#nameOfPlayers");

function onInputNumOfPlayers() {
    let nameOfPlayersInputs = document.querySelectorAll("#nameOfPlayers input");
    let nameOfPlayersLabels = document.querySelectorAll("#nameOfPlayers label");
    let brs = document.querySelectorAll("#nameOfPlayers br");
    let diff = numOfPlayers.value - nameOfPlayersInputs.length;
    while (diff > 0) {
        let id = "nameOfPlayer" + String(numOfPlayers.value - diff + 1);
        let newLabel = document.createElement("label");
        nameOfPlayersDiv.appendChild(newLabel);
        newLabel.htmlFor = id;
        newLabel.innerText = String(numOfPlayers.value - diff + 1) + ". játékos neve: ";

        let newInput = document.createElement("input");
        nameOfPlayersDiv.appendChild(newInput);
        newInput.id = id;
        newInput.type = "text";
        newInput.value = "Játékos" + String(numOfPlayers.value - diff + 1);

        nameOfPlayersDiv.appendChild(document.createElement("br"));

        diff--;
    }

    while (diff < 0) {
        nameOfPlayersInputs[numOfPlayers.value - diff - 1].remove();
        nameOfPlayersLabels[numOfPlayers.value - diff - 1].remove();
        brs[numOfPlayers.value - diff - 1].remove();

        diff++;
    }
}


let practiceRadio = document.querySelector("#practice");
practiceRadio.addEventListener("click", onClickGameModeRadio);
let competitionRadio = document.querySelector("#competition");
competitionRadio.addEventListener("click", onClickGameModeRadio);

let showHasSETButtonCheckBox = document.querySelector("#showHasSETButton");
let showShowSETButtonCheckBox = document.querySelector("#showShowSETButton");
let automaticRadio = document.querySelector("#automatic");
let manualRadio = document.querySelector("#manual");

let otherSettings = document.querySelector("#otherSettings");
let otherSettingsText = document.querySelector("#otherSettingsText");

function onClickGameModeRadio() {
    if (competitionRadio.checked) {
        showHasSETButtonCheckBox.checked = false;
        showShowSETButtonCheckBox.checked = false;
        automaticRadio.checked = true;
        manualRadio.checked = false;

        otherSettings.hidden = true;
        otherSettingsText.hidden = true;
    } else {
        otherSettings.hidden = false;
        otherSettingsText.hidden = false;
    }
}