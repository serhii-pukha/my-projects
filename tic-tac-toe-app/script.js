const crossClass = 'cross';
const circleClass = 'circle';
const winningCombinations = [ 
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const resultMessageElement = document.getElementById('resultMessage');
const restartButton = document.getElementById('restartButton');
const resultMessageTextElement = document.querySelector('[data-result-message-text]');
const turnMessageTextElement = document.querySelector('[data-turn-message-text]');
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);

/* starting parameters */
function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(crossClass);
        cell.classList.remove(circleClass);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    })
    turnMessageTextElement.innerText = "Player X's turn";
    resultMessageElement.classList.remove('visible');
}

/* click handler */
function handleClick(e) {
    const cell = e.target;
    if (circleTurn) {
        currentClass = circleClass;
    } else {
        currentClass = crossClass;
    }
    
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        gameResult(false);
    } else if (checkDraw()) {
        gameResult(true);
    } else {
        swapTurn();
    }
}

/* add to cell a 'cross' or 'circle' class */
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

/* writes a game result */
function gameResult(draw) {
    if (draw) {
        resultMessageTextElement.innerText = 'Draw!';
    } else if (circleTurn){
        resultMessageTextElement.innerText = "Player O wins!";
    } else {
        resultMessageTextElement.innerText = "Player X wins!";
    }
    resultMessageElement.classList.add('visible');
}

/* swaping turn */
function swapTurn() {
    circleTurn = !circleTurn;
    if (circleTurn) {
        turnMessageTextElement.innerText = "Player O's turn"
    } else {
        turnMessageTextElement.innerText = "Player X's turn"
    }
}

/* check for winning combinating for O's and X's */
function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        })
    })
}

/* check for draw  */
function checkDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(crossClass) || cell.classList.contains(circleClass);
    })
}