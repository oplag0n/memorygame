/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards(cards) {
    let shuffled = shuffle(cards);
    let cardElements = document.getElementsByClassName('card');   
    for (let i =0; i < cardElements.length; i++) {
        cardElements[i].children[0].className = shuffled[i] + ' fa';
    }

}
displayCards(cards);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 //Global Variables

const deck = document.querySelector('.deck');
let cardElements = document.getElementsByClassName('card');
let matched = 0;
const totalCards = 16;
const totalPairs = 8;
let openCards = []; 
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;



// Event Listeners

deck.addEventListener('click', event => {
    const clickTarget = event.target;
    displayTime();
    if (isClickValid(clickTarget)) {
        displayTime();
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addOpenCard(clickTarget);
        if (openCards.length === 2) {
            cardCheck();
            countMove();
            checkScore();
        }
    }
});

document.querySelector('.modal__cancel').addEventListener('click', () => {
    toggleModal();
});

document.querySelector('.restart').addEventListener('click', resetGame);

document.querySelector('.modal__replay').addEventListener('click', replayGame);


// Functions

function toggleCard(clickTarget) {
    clickTarget.classList.toggle('open');
    clickTarget.classList.toggle('show');
}

function isClickValid(clickTarget) {
    return (
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') && 
        openCards.length < 2 &&
        !openCards.includes(clickTarget)
    );
}


function mainAction(event) {
    showCard(event.target);
    if (openCards.length > 1) {
        count();
        if (cardCheck()) {
            lockOpen();
        } else {
            closeCards();
        } 
    }
}

function showCard(target) {
    target.className += ' open show';
    addOpenCard(target);
    target.removeEventListener('click', mainAction);
}

function addOpenCard(clickTarget) {
    openCards.push(clickTarget);
    console.log(openCards);
}

function clearList(array) {
    array.pop();
    array.pop();
}

function cardCheck() {
    if (openCards[0].firstElementChild.className === 
            openCards[1].firstElementChild.className) {
        openCards[0].classList.toggle("match");
        openCards[1].classList.toggle("match");
        openCards = [];
        matched++;
        } else {
            setTimeout(() => {
                console.log("Not a match");
                toggleCard(openCards[0]);
                toggleCard(openCards[1]);
                openCards = [];
            }, 1000);
        }
    if (matched === totalPairs) {
        gameOver();
    }
}

function lockOpen() {
    let openElements = Array.from(document.getElementsByClassName('open'));
    for (let i = 0; i < openElements.length; i++) {
        matchedIndex++;
        openElements[i].className = "card match";
    }
    clearList(openCards);
}

function closeCards() {
    setTimeout( function() {
        let openElements = Array.from(document.getElementsByClassName('open'));
        for (let i = 0; i < openElements.length ; i++) {
            openElements[i].className = "card";
            openElements[i].addEventListener('click', mainAction);
        }
        clearList(openCards);
    }, 1000);
    
}

function countMove() {
    moves++;
    let score = document.querySelector(".moves");
    score.innerHTML = moves;
}

function checkScore() {
    if (moves === 18 || moves === 28) {
        hideStar();
    }
}

function hideStar() {
    const stars = document.querySelectorAll('.stars li');
    for (star of stars) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

function startClock() {
    clockId = setInterval(() => {
        time++;
    }, 1000);
}

function displayTime() {
    const clock = document.querySelector('.clock');
    console.log(clock);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

function stopClock() {
    clearInterval(clockId);
}

function toggleModal() {
    const modal = document.querySelector(".modal__background");
    modal.classList.toggle('hide');
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal__time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const moveStat = document.querySelector('.modal__moves');
    const starsStat = document.querySelector('.modal__stars');
    const stars = getStars();

    timeStat.innerHTML = `Time = ${clockTime}`;
    moveStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
    let stars = document.querySelectorAll('.stars li');
    let starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    resetCards();
    matched = 0; 
    displayCards(cards);
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime(); 
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

function gameOver () {
    stopClock();
    writeModalStats();
    toggleModal();
}

function replayGame() {
    resetGame();
    toggleModal();
}

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}