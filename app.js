
const diceArea = document.getElementById('dice-area');
const dice = [];

function addDie(type) {
    if (['1','2','3','4','5','6'].includes(type)) {
        if (dice.some(d => d.type === type)) return;
    }
    const die = { type: type, value: '' };
    die.value = ['1','2','3','4','5','6'].includes(type) ? type :
        type === 'frein' ? 'Brake' :
        type === 'boost' ? 'Boost' :
        type === 'leader' ? 'Leader' :
        type === 'gaz' ? 'Gaz' : '?';

    dice.push(die);
    renderDice();
}

function rollDie(die) {
    let result = '';
    if (['1','2','3'].includes(die.type)) {
        result = ['' , '' , '' , '' , '' , '⚠️'][Math.floor(Math.random() * 6)] || die.type;
    } else if (['4','5','6'].includes(die.type)) {
        result = ['' , '' , '' , '⚠️' , '⚠️' , die.type][Math.floor(Math.random() * 6)];
    } else {
        result = ['', '', '', '', '', '⚠️'][Math.floor(Math.random() * 6)];
    }
    die.value = result || die.type;
}

function renderDice() {
    diceArea.innerHTML = '';
    dice.forEach(die => {
        const dieDiv = document.createElement('div');
        dieDiv.className = 'die';
        dieDiv.innerText = die.value;
        if (['1','2','3','4','5','6'].includes(die.type)) {
            dieDiv.classList.add('black-die');
            dieDiv.setAttribute('data-value', die.value);
        } else {
            dieDiv.classList.add(
                die.type === 'frein' ? 'red-die' :
                die.type === 'boost' ? 'green-die' :
                die.type === 'leader' ? 'orange-die' :
                die.type === 'gaz' ? 'white-die' : ''
            );
        }
        dieDiv.onclick = () => { rollDie(die); renderDice(); };
        diceArea.appendChild(dieDiv);
    });
}

function rollAllDice() { dice.forEach(rollDie); renderDice(); }
function resetDice() { dice.length = 0; renderDice(); }
