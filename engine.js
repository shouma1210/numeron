// engine.js

/**
 * EatとBiteを計算する
 */
export function getEatBite(target, guess) {
    let eat = 0;
    let bite = 0;
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === target[i]) {
            eat++;
        } else if (target.includes(guess[i])) {
            bite++;
        }
    }
    return { eat, bite };
}

/**
 * 0-9から重複なしで3桁の数字を生成
 */
export function generateTarget() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits.slice(0, 3);
}

/**
 * ランダムに推測するプレイヤ
 */
export class RandomPlayer {
    guess() {
        return generateTarget();
    }
    // updateは不要
}

/**
 * 候補を絞り込むロジックプレイヤ
 */
export class LogicPlayer {
    constructor() {
        this.candidates = this.generateAllCandidates();
    }

    // 全てのあり得る組み合わせ（720通り）を生成
    generateAllCandidates() {
        const list = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (i === j) continue;
                for (let k = 0; k < 10; k++) {
                    if (i === k || j === k) continue;
                    list.push([i, j, k]);
                }
            }
        }
        return list;
    }

    guess() {
        // 残っている候補からランダムに1つ選ぶ
        const idx = Math.floor(Math.random() * this.candidates.length);
        return this.candidates[idx];
    }

    // 結果を受けて候補をフィルタリングする
    update(guess, eat, bite) {
        this.candidates = this.candidates.filter(c => {
            const res = getEatBite(c, guess);
            return res.eat === eat && res.bite === bite;
        });
    }
}