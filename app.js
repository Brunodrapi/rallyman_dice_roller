
const diceArea = document.getElementById('dice-area');
const dice = [];

function addDie(type) {
    if (['1','2','3','4','5','6'].includes(type)) {
        if (dice.some(d => d.type === type)) {
            return; // Déjà ajouté
        }
    }

    const die = { type: type, value: '' };

    if (['1','2','3','4','5','6'].includes(type)) {
        die.value = type;
    } else {
        switch(type) {
            case 'frein': die.value = 'Frein'; break;
            case 'boost': die.value = 'Boost'; break;
            case 'leader': die.value = 'Leader'; break;
            case 'gaz': die.value = 'Gaz'; break;
            default: die.value = '?';
        }
    }

    dice.push(die);
    renderDice();
}

function rollDie(die) {
    let result = '';

    if (['1','2','3'].includes(die.type)) {
        const faces = [die.type, '', '', '', '', '⚠️'];
        result = faces[Math.floor(Math.random() * 6)];
    } else if (['4','5','6'].includes(die.type)) {
        const faces = [die.type, '', '', '', '⚠️', '⚠️'];
        result = faces[Math.floor(Math.random() * 6)];
    } else if (die.type === 'gaz' || die.type === 'boost') {
        const faces = ['', '', '', '', '', '⚠️'];
        result = faces[Math.floor(Math.random() * 6)];
    } else if (die.type === 'frein' || die.type === 'leader') {
        const faces = ['', '', '', '', '⚠️', '⚠️'];
        result = faces[Math.floor(Math.random() * 6)];
    } else {
        result = '?';
    }

    die.value = result === '' ? '' : result;
}

function renderDice() {
    diceArea.innerHTML = '';
    dice.forEach((die, index) => {
        const dieDiv = document.createElement('div');
        dieDiv.className = 'die';
        dieDiv.innerText = die.value;

        if (['1','2','3','4','5','6'].includes(die.type)) {
            dieDiv.classList.add('black-die');
            dieDiv.setAttribute('data-value', die.value);
        } else if (die.type === 'frein') {
            dieDiv.classList.add('red-die');
        } else if (die.type === 'boost') {
            dieDiv.classList.add('green-die');
        } else if (die.type === 'gaz') {
            dieDiv.classList.add('white-die');
        } else if (die.type === 'leader') {
            dieDiv.classList.add('orange-die');
        }

        dieDiv.onclick = () => {
            rollDie(die);
            renderDice();
        };
        diceArea.appendChild(dieDiv);
    });
}

function rollAllDice() {
    dice.forEach(rollDie);
    renderDice();
}

function resetDice() {
    dice.length = 0;
    renderDice();
}
