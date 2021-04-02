let players;
let deck;
let cardsOnTable;
let indexesOfSelectedCards;
let selectedByComputer;
let automaticExpansion;
let rankedUpdateTimer;
let rankedElapsedTime;

let messageForSelection = document.querySelector("#messageForSelection");
let messageForOther = document.querySelector("#messageForOther");

let remainingCards = document.querySelector("#remainingCards");



function initialize() {
    players = [];
    deck = [];
    cardsOnTable = [];
    indexesOfSelectedCards = [];
    selectedByComputer = [];
    onTable = 12;
    hasSelected = false;

    gameTable.innerHTML = "";
    playersTable.innerHTML = "";
    scores.innerHTML = "";

    messageForSelection.innerText = "";
    messageForOther.innerText = "";

    remainingCards.innerText = "";
    elapsedTimeSpan.innerText = "";
    endTimeDiv.innerText = "";

    window.clearTimeout(timer);
    timer = null;

    window.clearTimeout(rankedUpdateTimer);
    rankedUpdateTimer = null;
    rankedElapsedTime = 0;
}

function generateDeck() {
    let deckWith81CardsRadio = document.querySelector("#deckWith81Cards");

    for (let shape = shapes.ellipse; shape <= shapes.rhomb; shape++) {
        for (let color = colors.red; color <= colors.purple; color++) {
            for (let number = numbers.one; number <= numbers.three; number++) {
                if (deckWith81CardsRadio.checked) {
                    for (let inside = insides.full; inside <= insides.empty; inside++) {
                        deck.push(new Card(shape, color, number, inside));
                    }
                } else { deck.push(new Card(shape, color, number, insides.full)); }
            }
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}



let openingPage = document.querySelector("#openingPage");
let gamePage = document.querySelector("#gamePage");
let endScreen = document.querySelector("#endScreen");

function changePages() {
    openingPage.hidden = true;
    gamePage.hidden = false;
}



let gameTable = document.querySelector("#game");
let onTable;

function generateTable() {
    for (let row = 0; row < 3; row++) {
        let tr = document.createElement("tr");
        let matrixRow = [];

        for (let cell = 0; cell < onTable / 3; cell++) {
            let td = document.createElement("td");
            tr.appendChild(td);

            let card = deck.shift();
            matrixRow.push(card);

            td.appendChild(renderCard(card));
        }

        gameTable.appendChild(tr);
        cardsOnTable.push(matrixRow);
    }

    remainingCards.innerText = "Pakliban van: " + deck.length + " kártya";

    nextStep();
}

function renderCard(card) {
    let tdImage = document.createElement("img");
    let path = "./images/icons/" + card.numberPath + card.insidePath + card.colorPath + card.shapePath + ".svg";
    tdImage.src = path;
    tdImage.addEventListener("click", selectCard);

    return tdImage;
}

let hasSETButton = document.querySelector("#hasSETButton");
let showSETButton = document.querySelector("#showSETButton");
let draw3CardButton = document.querySelector("#draw3CardButton");

function showGameButtons() {
    if (showHasSETButtonCheckBox.checked) { hasSETButton.hidden = false; }
    else { hasSETButton.hidden = true; }

    if (showShowSETButtonCheckBox.checked) { showSETButton.hidden = false; }
    else { showSETButton.hidden = true; }

    if (manualRadio.checked) { draw3CardButton.hidden = false; automaticExpansion = false; }
    else { draw3CardButton.hidden = true; automaticExpansion = true; }

    messageForSelection.hidden = false;
    messageForOther.hidden = false;
}



class Player {
    points = 0;
    selectable = true;

    constructor(name) {
        this.name = name;
    }
}

function createPlayers() {
    let nameOfPlayers = document.querySelectorAll("#nameOfPlayers input");
    nameOfPlayers.forEach(nameInput => {
        players.push(new Player(nameInput.value));
    });
}



let playersTable = document.querySelector("#players");

function generatePlayersTable() {
    let row1 = document.createElement("tr");
    playersTable.appendChild(row1);

    let row2 = document.createElement("tr");
    playersTable.appendChild(row2);

    for (let i = 0; i < players.length; i++) {
        let td1 = document.createElement("td");
        row1.appendChild(td1);

        let td2 = document.createElement("td");
        row2.appendChild(td2);

        td1.innerText = players[i].name;
        if (players.length > 1) {
            td1.addEventListener("click", selectPlayer);
        } else {
            td1.classList.add("selected");
            hasSelected = true;
            selectedPlayerIndex = 0;
        }
        td2.innerText = "0 pont";
    }
}



let timer;
let hasSelected;
let selectedPlayerIndex;

function selectPlayer() {
    let newSelectedPlayerIndex = this.cellIndex;

    if (!hasSelected && players[newSelectedPlayerIndex].selectable) {
        hasSelected = true;
        timer = window.setTimeout(deselectPlayer, 10000);

        selectedPlayerIndex = newSelectedPlayerIndex;
        players[selectedPlayerIndex].selectable = false;
        this.classList.toggle("selected");
    }
}

function deselectPlayer(had3Selection) {
    if (had3Selection == undefined) {
        messageForSelection.setAttribute("class", "");
        messageForSelection.innerText = "Lejárt az időd... Kimaradsz ebből a körből.";
    }

    if (players.length > 1) {
        hasSelected = false;
        document.querySelectorAll("#players td")[selectedPlayerIndex].classList.toggle("selected");

        canAnyPlayerBeSelected();

        window.clearTimeout(timer);
        timer = null;
    }

    deselectCards();
}

function canAnyPlayerBeSelected() {
    let hasSelectable = false;
    players.forEach(player => {
        if (player.selectable) {
            hasSelectable = true;
        }
    });

    if (!hasSelectable) {
        for (let i = 0; i < players.length; i++) {
            players[i].selectable = true;
        }
        
        if (messageForSelection.innerText.includes("Helytelen...")) { messageForSelection.innerText = "Helytelen..."; }
        else { messageForSelection.innerText = "Lejárt az időd..."; }
        messageForOther.innerText = "Újra mindenki részt vehet a körben.";
    }
}



class IndexPair {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

function selectCard() {
    if (hasSelected) {
        if (indexesOfSelectedCards.length < 3) {
            let cellIndex = this.parentNode.cellIndex;
            let rowIndex = this.parentNode.parentNode.rowIndex;

            let indexesOfSelected = new IndexPair(rowIndex, cellIndex);
            if (!indexesOfSelectedCards.some(elem => elem.i == indexesOfSelected.i && elem.j == indexesOfSelected.j)) {
                indexesOfSelectedCards.push(new IndexPair(rowIndex, cellIndex));
                this.classList.toggle("selected");
            } else {
                indexesOfSelectedCards = indexesOfSelectedCards.filter(elem => elem.i != indexesOfSelected.i || elem.j != indexesOfSelected.j);
                this.classList.toggle("selected");
            }
        }
        if (indexesOfSelectedCards.length == 3) {
            areSelectedCardsASET(indexesOfSelectedCards, true);
            deselectCards();

            nextStep();
        }
    }
}

function areSelectedCardsASET(indexesOfSelectedCards, haveToEditTable) {
    let numbers = [];
    let shapes = [];
    let colors = [];
    let insides = [];

    for (let i = 0; i < indexesOfSelectedCards.length; i++) {
        numbers.push(cardsOnTable[indexesOfSelectedCards[i].i][indexesOfSelectedCards[i].j].number);
        shapes.push(cardsOnTable[indexesOfSelectedCards[i].i][indexesOfSelectedCards[i].j].shape);
        colors.push(cardsOnTable[indexesOfSelectedCards[i].i][indexesOfSelectedCards[i].j].color);
        insides.push(cardsOnTable[indexesOfSelectedCards[i].i][indexesOfSelectedCards[i].j].inside);
    }

    numbers.sort();
    shapes.sort();
    colors.sort();
    insides.sort();

    let deckWith81Cards = document.querySelector("#deckWith81Cards");
    let correct;
    if (deckWith81Cards.checked) {
        correct = (isArrayStrictlyIncreasing(numbers) || numbers.every(e => e == numbers[0]))
        && (isArrayStrictlyIncreasing(shapes) || shapes.every(e => e == shapes[0]))
        && (isArrayStrictlyIncreasing(colors) || colors.every(e => e == colors[0]))
        && (isArrayStrictlyIncreasing(insides) || insides.every(e => e == insides[0]));
    }
    else {
        correct = (isArrayStrictlyIncreasing(numbers) || numbers.every(e => e == numbers[0]))
        && (isArrayStrictlyIncreasing(shapes) || shapes.every(e => e == shapes[0]))
        && (isArrayStrictlyIncreasing(colors) || colors.every(e => e == colors[0]));
    }

    if (haveToEditTable) {
        if (correct) {
            players[selectedPlayerIndex].points++;
            playersTable.rows[1].cells[selectedPlayerIndex].innerText = players[selectedPlayerIndex].points + " pont";

            swapCards();

            for (let i = 0; i < players.length; i++) {
                players[i].selectable = true;
            }

            messageForSelection.innerText = "Helyes! ";
            messageForSelection.classList.add("correct");
            messageForSelection.classList.remove("incorrect");
        } else {
            players[selectedPlayerIndex].points--;
            playersTable.rows[1].cells[selectedPlayerIndex].innerText = players[selectedPlayerIndex].points + " pont";

            messageForSelection.innerText = "Helytelen...";
            if (players.length > 1) { messageForSelection.innerText = messageForSelection.innerText + " Kimaradsz ebből a körből. "; }
            messageForSelection.classList.add("incorrect");
            messageForSelection.classList.remove("correct");
        }

        messageForOther.innerText = "";
        deselectPlayer(true);
    }

    return correct;
}

function isArrayStrictlyIncreasing(array) {
    if (array.length <= 1) { return true; }

    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] >= array[i + 1]) { return false; }
    }

    return true;
}

function swapCards() {
    indexesOfSelectedCards.forEach(selected => {
        if (cardsOnTable.length > 0) {
            let td = gameTable.rows[selected.i].cells[selected.j];
            td.childNodes[0].remove();
            delete cardsOnTable[selected.i][selected.j];
            
            if (deck.length > 0 && onTable == 12) {
                td.appendChild(renderCard(cardsOnTable[selected.i][selected.j] = deck.shift()));
                remainingCards.innerText = "Pakliban van: " + deck.length + " kártya";
            } else {
                onTable--;
            }
        }
    });
}

function nextStep() {
    let oneSet = getOneSET();

    if (onTable == 0 || (oneSet == null && deck.length == 0)) {
        gameOver();
    } else if (oneSet == null && deck.length > 0) {
        if (automaticExpansion) {
            do {
                draw3Cards();
                oneSet = getOneSET();
            } while (oneSet == null && deck.length > 0);
            if (oneSet == null && deck.length == 0) { gameOver(); }
        }
    }
}

function getOneSET() {
    let numOfCards = cardsOnTable[0].length * 3;
    let indexesOfSelectedCards = [];
    let found = false;

    for (let first = 0; first < numOfCards; first++) {
        indexesOfSelectedCards.length = 3;

        indexesOfSelectedCards[0] = new IndexPair(first % 3, parseInt(first / 3));
        if (cardsOnTable[indexesOfSelectedCards[0].i][indexesOfSelectedCards[0].j] == undefined) { continue; }

        for (let second = 0; second < numOfCards; second++) {
            indexesOfSelectedCards[1] = new IndexPair(second % 3, parseInt(second / 3));
            if (cardsOnTable[indexesOfSelectedCards[1].i][indexesOfSelectedCards[1].j] == undefined) { continue; }
            if (first == second) { continue; }

            for (let third = 0; third < numOfCards; third++) {
                indexesOfSelectedCards[2] = new IndexPair(third % 3, parseInt(third / 3));
                if (cardsOnTable[indexesOfSelectedCards[2].i][indexesOfSelectedCards[2].j] == undefined) { continue; }
                if (first == third || second == third) { continue; }

                if (areSelectedCardsASET(indexesOfSelectedCards, false)) {
                    found = true;
                    break;
                }
            }

            if (found) { break; }
        }

        if (found) { break; }
    }

    if (found) { return indexesOfSelectedCards; }
    else { return null; } 
}

let scores = document.querySelector("#scores");
let endTimeDiv = document.querySelector("#endTime");

function gameOver() {
    stopRankedTimer();
    gamePage.hidden = true;
    endScreen.hidden = false;

    players.sort((a, b) => b.points - a.points);


    let trHead = document.createElement("tr");
    scores.appendChild(trHead);

    let ratingHead = document.createElement("th");
    let nameHead = document.createElement("th");
    let pointsHead = document.createElement("th");

    ratingHead.innerText = "#";
    nameHead.innerText = "Név";
    pointsHead.innerText = "Pontszám";

    trHead.appendChild(ratingHead);
    trHead.appendChild(nameHead);
    trHead.appendChild(pointsHead);

    players.forEach((player, i) => {
        let tr = document.createElement("tr");
        scores.appendChild(tr);

        let ratingTd = document.querySelector("td");
        let nameTd = document.createElement("td");
        let pointsTd = document.createElement("td");

        tr.appendChild(ratingTd);
        tr.appendChild(nameTd);
        tr.appendChild(pointsTd);

        ratingTd.innerText = i + 1;
        nameTd.innerText = player.name;
        pointsTd.innerText = player.points;
    });

    if (numOfPlayers.value == 1 && competitionRadio.checked) {
        endTimeDiv.innerText = "Eltelt idő: " + rankedElapsedTime + " mp.";
    }
}

function draw3Cards() {
    cardsOnTable.forEach(row => {
        row.push(deck.shift());
    });

    remainingCards.innerText = "Pakliban van: " + deck.length + " kártya";

    let gameTable = document.querySelectorAll("#game tr");

    gameTable.forEach((row, i) => {
        let td = document.createElement("td");
        row.appendChild(td);

        td.appendChild(renderCard(cardsOnTable[i][cardsOnTable[i].length - 1]));
    });

    onTable += 3;
    messageForOther.innerText = "Lerakva 3 extra lap.";

    nextStep();
}

function deselectCards() {
    indexesOfSelectedCards.forEach(selected => {
        if (gameTable.rows[selected.i].cells[selected.j].childNodes[0] != undefined) {
            gameTable.rows[selected.i].cells[selected.j].childNodes[0].classList.remove("selected");
        }
    });
    indexesOfSelectedCards = [];

    selectedByComputer.forEach(selected => {
        if (gameTable.rows[selected.i].cells[selected.j].childNodes[0] != undefined) {
            gameTable.rows[selected.i].cells[selected.j].childNodes[0].classList.remove("selectedByComputer");
        }
    });
    selectedByComputer = [];
}



let startButton = document.querySelector("#startButton");
startButton.addEventListener("click", handleStartButtonClick);

function handleStartButtonClick() {
    initialize();
    generateDeck();
    shuffleDeck();
    console.log(deck);

    changePages();
    showGameButtons();
    generateTable();

    createPlayers();
    generatePlayersTable();

    startRankedTimerIf();
}

let restartButton = document.querySelector("#restart");
restartButton.addEventListener("click", handleRestartButtonClick);

function handleRestartButtonClick() {
    handleHomeButton();
    handleStartButtonClick();
}



hasSETButton.addEventListener("click", handleHasSETButton);

function handleHasSETButton() {
    if (getOneSET() == null) { messageForSelection.innerText = "Nincs több SET."; }
    else { messageForSelection.innerText = "Van SET."; }
    messageForSelection.setAttribute("class", "");
}

showSETButton.addEventListener("click", handleShowSETButton);

function handleShowSETButton() {
    let gameTable = document.querySelectorAll("#game tr");

    selectedByComputer = getOneSET();
    if (selectedByComputer != null) {
        selectedByComputer.forEach(card => {
            gameTable[card.i].childNodes[card.j].childNodes[0].classList.add("selectedByComputer");
        });
    }
}

draw3CardButton.addEventListener("click", handleDraw3CardButton);

function handleDraw3CardButton() {
    if (deck.length > 0) {
        deselectCards();
        draw3Cards();
    }
}



let homeButton = document.querySelector("#home");
homeButton.addEventListener("click", handleHomeButton);

function handleHomeButton() {
    endScreen.hidden = true;
    openingPage.hidden = false;
}



let elapsedTimeSpan = document.querySelector("#elapsedTime");

function startRankedTimerIf() {
    let competitionRadio = document.querySelector("#competition");

    if (numOfPlayers.value == 1 && competitionRadio.checked) {
        elapsedTimeSpan.innerText = "Eltelt idő: 0 mp.";
        rankedElapsedTime = 0;
        rankedUpdateTimer = window.setTimeout(updateRankedTimer, 1000);
    }
}

function updateRankedTimer() {
    elapsedTimeSpan.innerText = "Eltelt idő: " + (++rankedElapsedTime) + " mp.";
    rankedUpdateTimer = window.setTimeout(updateRankedTimer, 1000);
}

function stopRankedTimer() {
    window.clearTimeout(rankedUpdateTimer);
    rankedUpdateTimer = null;
}