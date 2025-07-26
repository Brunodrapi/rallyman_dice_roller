
const diceArea = document.getElementById('dice-area');
const dice = [];

// --- Probabilités /!\ ---
function toggleProbabilities() {
    const section = document.getElementById('probabilities-section');
    if (section) {
        section.style.display = section.style.display === "none" ? "block" : "none";
    }
}

function updateProbabilities() {
    // Récupère la liste des dés sélectionnés
    // Pour chaque dé, on détermine la proba d'obtenir /!\
    const dangerProbs = dice.map(die => {
        if (['1','2','3'].includes(die.type)) return 1/6;
        if (['4','5','6'].includes(die.type)) return 2/6;
        if (die.type === 'gaz' || die.type === 'boost') return 1/6;
        if (die.type === 'frein' || die.type === 'leader') return 2/6;
        return 0;
    });

    // Calcul des probabilités d'obtenir exactement k /!\ (k=1,2,3)
    // On utilise la convolution pour la somme de variables de Bernoulli de proba différentes
    // probas[k] = proba d'obtenir exactement k /!\
    let probas = [1]; // proba d'obtenir 0 /!\
    for (let p of dangerProbs) {
        const next = Array(probas.length + 1).fill(0);
        for (let k = 0; k < probas.length; ++k) {
            next[k] += probas[k] * (1 - p);     // pas de /!\
            next[k+1] += probas[k] * p;         // un /!\
        }
        probas = next;
    }
    // probas[k] = proba d'obtenir exactement k /!\
    // On veut la proba d'obtenir au moins k /!\
    // P(≥k) = somme des probas[j] pour j=k à N
    const N = dangerProbs.length;
    for (let k = 1; k <= 4; ++k) {
        let p = 0;
        for (let j = k; j <= N; ++j) {
            p += probas[j] || 0;
        }
        const el = document.getElementById(`prob-${k}-danger`);
        if (el) {
            let probaAffichee = N >= k ? (p*100) : 0;
            let emoji = "🟢";
            if (probaAffichee >= 25 && probaAffichee <= 65) {
                emoji = "🟡";
            } else if (probaAffichee > 65) {
                emoji = "🔴";
            }
            el.textContent = `${k} ⚠️ : ${probaAffichee.toFixed(1)} % ${emoji}`;
        }
    }
    // Si moins de k dés, afficher 0%
    for (let k = dangerProbs.length+1; k <= 4; ++k) {
        const el = document.getElementById(`prob-${k}-danger`);
        if (el) {
            el.textContent = `${k} ⚠️\ : 0.0 %`;
        }
    }
}

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
            case 'frein': die.value = 'Brake'; break;
            case 'boost': die.value = 'Boost'; break;
            case 'leader': die.value = 'Leader'; break;
            case 'gaz': die.value = 'Gaz'; break;
            default: die.value = '?';
        }
    }

    dice.push(die);
    renderDice();
    updateProbabilities();
}

const diceSound = new Audio('sounds/dice-roll.mp3');

function playDiceSound() {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle && soundToggle.checked) {
        diceSound.currentTime = 0; // Remet au début pour rejouer rapidement
        diceSound.play();
    }
}

/* function adjustDiceSize() {
    const totalDice = dice.length;
    let sizePercent = 15;

    if (totalDice >= 20) {
        sizePercent = 6;
    } else if (totalDice >= 15) {
        sizePercent = 8;
    } else if (totalDice >= 10) {
        sizePercent = 10;
    }

    document.querySelectorAll('.die').forEach(die => {
        die.style.width = sizePercent + 'vw';
        die.style.height = sizePercent + 'vw';
        die.style.fontSize = (sizePercent * 0.4) + 'vw';  // Texte toujours proportionnel

        die.style.display = 'flex';
        die.style.justifyContent = 'center';
        die.style.alignItems = 'center';
        die.style.overflow = 'hidden';
        die.style.whiteSpace = 'nowrap';
        die.style.textOverflow = 'ellipsis';
    });
} */

function rollDie(die) {
    let result = '';

    if (['1','2','3'].includes(die.type)) {
        const faces = [die.type, die.type, die.type, die.type, die.type, '⚠️'];
        result = faces[Math.floor(Math.random() * 6)];
    } else if (['4','5','6'].includes(die.type)) {
        const faces = [die.type, die.type, die.type, die.type, '⚠️', '⚠️'];
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
        let displayValue = die.value;

        // Toujours abréger pour l'affichage dans les dés sélectionnés
        if (displayValue === 'Brake') displayValue = 'BRK';
        else if (displayValue === 'Boost') displayValue = 'BST';
        else if (displayValue === 'Leader') displayValue = 'LDR';
        else if (displayValue === 'Gaz') displayValue = 'GAZ';
        // "Gaz" reste "Gaz" (ou "GAZ" si tu veux tout en majuscules)

        dieDiv.className = 'die';
        dieDiv.innerText = displayValue;

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
            playDiceSound();
            updateProbabilities();
        };
        diceArea.appendChild(dieDiv);
        /* adjustDiceSize(); */
    });
}

function rollAllDice() {
    dice.forEach(rollDie);
    renderDice();
    playDiceSound();
    updateProbabilities();
}

function resetDice() {
    dice.length = 0;
    renderDice();
    updateProbabilities();
}

// Enlève le dernier dé posé
function removeLastDie() {
    if (dice.length > 0) {
        dice.pop();
        renderDice();
        updateProbabilities();
    }
}
