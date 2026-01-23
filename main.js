import { getEatBite, generateTarget, LogicPlayer, RandomPlayer } from './engine.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const logEl = document.getElementById('log');
const statusEl = document.getElementById('status');
const turnEL = document.getElementById('turnCount');
const startBtn = document.getElementById('startBtn');
const evalBtn = document.getElementById('evalBtn');

async function runSingleGame() {
    logEl.innerHTML = "";
    startBtn.disabled = true;

    const type = document.getElementById('playerType').value;
    const target = generateTarget();
    const player = (type === 'logic') ? new LogicPlayer() : new RandomPlayer();
    
    let win = false;
    let turn = 0;
    logEl.innerHTML += `<div> 正解： ${target.join('')} に設定しました</div><hr>`;
    while (!win) {
        turn++;
        turnEL.textContent = turn;
        statusEl.textContent = "考え中...";
        
        const guess = player.guess();
        const { eat, bite } = getEatBite(target, guess);

        let logMsg = `<div><strong>${turn}手目：</strong> ${guess.join('')} => ${eat}E, ${bite}B`;
        if (type === 'logic') {
            logMsg += `<small>(残り候補：${player.candidates.length})</small>`;
        }
        logMsg += `</div>`;
        logEl.innerHTML += logMsg;
        logEl.scrollTop = logEl.scrollHeight;

        if (eat === 3) {
            win = true;
            statusEl.textContent = "クリア！";
            logEl.innerHTML += `<div style="color:green; font-weight:bold;">正解！(合計： ${turn}手)</div>`;
        } else {
            if (player.update)
                player.update(guess, eat, bite);
                await sleep(500);
        }
    }
    startBtn.disabled = false;
}

async function runEvaluation(trials = 1000) {
    const type = document.getElementById('playerType').value;
    let totalTurns = 0;
    let results = [];

    console.log(`${type}で${trials}回試行中...`);
    for (let i = 0; i < trials; i++) {
        const target = generateTarget();
        const player = (type === 'logic') ? new LogicPlayer : new RandomPlayer();
        let turn = 0;
        let win = false;

        while (!win) {
            turn++;
            const guess = player.guess();
            const { eat, bite } = getEatBite(target, guess);
            if (eat === 3) {
                win = true;
            } else {
                if (player.update)
                    player.update(guess, eat, bite);
            }
            if (turn > 2000) break;
        }
        results.push(turn);
        totalTurns += turn;
    }
    const avg = totalTurns / trials;
    const max = Math.max(...results);
    alert(`【評価結果】\n試行回数：${trials}\n平均手数：${avg.toFixed(2)}手\n最大手数：${max}手`);
}

startBtn.addEventListener('click', runSingleGame);
if (evalBtn) {
    evalBtn.addEventListener('click', () => runEvaluation(1000));
}