const rootElement = document.getElementById('root');
const CARD_TYPES = ["hulk", "iron-man", "captain-America", "thor", "batman", "black-panther", "ultron", "spider-man"];

function shuffleArray(array) {
    for(let j, x, i = array.length; i; j = parseInt(Math.random() * i),
        x = array[--i], array[i] = array[j], array[j] = x);

    return array;
}

class Game {
    constructor(container, cardTypes, levelsParams) {
        this.container = container;

        this.level = 1;
        this.hearts = 0;

        this.cardTypes = cardTypes;
        this.levelsParams = levelsParams;
        this.numberOfCards = 16;

        this.container.addEventListener('click', this.handleClick.bind(this));
    }

    start() {
        this.clicksRemain = this.currentLevelParams.clicks;

        this.container.innerHTML = '';
        this.fillGameState();
        this.fillGameArea();
    }

    showMsg(msg) {
        this.container.innerHTML = '';

        const box = document.createElement('div');
        box.className = 'msg fadeIn';

        const message = document.createElement('p');
        message.innerHTML = msg;

        const level = document.createElement('p');
        level.className = 'level';
        level.textContent = `Level ${ this.level }`;

        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.addEventListener('click', this.start.bind(this));

        box.append(message, level, startButton);
        this.container.appendChild(box);
    }

    fillGameState() {
        const header = document.createElement('header');
        header.innerHTML = `
      <p><span class="level">${ this.level }</span> level</p>
      <p class="hearts">${ this.hearts }</p>
      <p><span class="clicks">${ this.clicksRemain }</span> clicks</p> `;

        this.container.appendChild(header);
    }

    fillGameArea() {
        const gameArea = document.createElement('div');
        gameArea.className = 'game-area fadeIn';

        const cards = this.shuffleCardTypes();

        cards.forEach(function addCard(cardType) {
            gameArea.innerHTML += `
          <div class="card ${ cardType }">
            <div class="front"></div>
            <div class="back"></div>
          </div> `;
        });

        this.container.appendChild(gameArea);
    }

    get openedCards() {
        return document.querySelectorAll('.opened');
    }

    get closedCards() {
        return document.querySelectorAll('.closed');
    }

    get currentLevelParams() {
        return this.levelsParams[this.level - 1];
    }

    open(card) {
        card.classList.add('opened');
    }

    close(cards) {
        if (this.clicksRemain === this.currentLevelParams.clicks - 2) { // means success with first couple of cards
            this.getHeart();
        }

        setTimeout(function() {
            cards.forEach(function(card) {
                card.classList.add('closed');
                card.classList.remove('opened');
            });

            this.checkVictory();
        }.bind(this), 300);
    }

    hide(cards) {
        cards.forEach(function(card) {
            card.classList.remove('opened');
        })
    }

    shuffleCardTypes() {
        const { numberOfCardTypes } = this.currentLevelParams;
        const randomTypes = shuffleArray(this.cardTypes).slice(0, numberOfCardTypes);
        let result = [];

        for (let i = 1; i <= this.numberOfCards / numberOfCardTypes; i++) {
            result = result.concat(randomTypes);
        }

        return shuffleArray(result);
    }

    handleClick(event) {
        const card = event.target.closest('.card');

        if (card && !this.isCardOpened(card)) {
            if (this.openedCards.length === 2) {
                this.hide(this.openedCards);
            }

            this.open(card);
            this.hasClicked();

            if (this.openedCards.length === 2) {
                this.compareOpenCards();
            }
        }
    }

    isCardOpened(card) {
        return card.classList.contains('opened');
    }

    compareOpenCards() {
        if (this.openedCards[0].className === this.openedCards[1].className) {
            this.close(this.openedCards);
        }
    }

    hasClicked() {
        this.clicksRemain--;

        if (this.clicksRemain === 0 && this.closedCards.length !== this.numberOfCards - 2) {
            return this.restart();
        }

        document.querySelector('.clicks').textContent = this.clicksRemain;
    }

    restart() {
        if (this.hearts === 0) {
            this.level = 1;
            this.showMsg('Oops... You lost! <br /> Try again :)')
        } else {
            this.hearts--;
            this.showMsg('A heart gives you a chance!');
        }
    }

    checkVictory() {
        if (this.closedCards.length === this.numberOfCards) {
            this.updateLevel();
        }
    }

    updateLevel() {
        if (this.level < 10) {
            this.level++;
            this.showMsg('<p>Good job! <br /> Move on</p> ');
        } else {
            this.level = 1;
            this.hearts = 0;
            this.showMsg('<p>Congratulations! <br /> You are the winner!</p>')
        }
    }

    getHeart() {
        this.hearts++;
        document.querySelector('.hearts').textContent = this.hearts;

        const heart = document.createElement('img');
        heart.className = 'big-heart fadeIn';
        heart.setAttribute('src', '../img/bigHeart.png');
        this.container.appendChild(heart);

        setTimeout(function() {
            this.container.removeChild(heart);
        }.bind(this), 1000);
    }
}

const LEVELS_PARAMS = [
    {
        clicks: 40,
        numberOfCards: 16,
        numberOfCardTypes: 2
    },
    {
        clicks: 30,
        numberOfCards: 16,
        numberOfCardTypes: 2
    },
    {
        clicks: 24,
        numberOfCards: 16,
        numberOfCardTypes: 2
    },
    {
        clicks: 42,
        numberOfCards: 16,
        numberOfCardTypes: 4
    },
    {
        clicks: 36,
        numberOfCards: 16,
        numberOfCardTypes: 4
    },
    {
        clicks: 30,
        numberOfCards: 16,
        numberOfCardTypes: 4
    },
    {
        clicks: 24,
        numberOfCards: 16,
        numberOfCardTypes: 4
    },
    {
        clicks: 36,
        numberOfCards: 16,
        numberOfCardTypes: 8
    },
    {
        clicks: 30,
        numberOfCards: 16,
        numberOfCardTypes: 8
    },
    {
        clicks: 24,
        numberOfCards: 16,
        numberOfCardTypes: 8
    }
];

const game = new Game(rootElement, CARD_TYPES, LEVELS_PARAMS);
game.showMsg('<p>Memory Pair Game</p>');